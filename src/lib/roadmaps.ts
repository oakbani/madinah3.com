// Auto-discover roadmaps from src/data/roadmaps/*.json and compute layout
// using dagre at build time. Layout is deterministic, so the resulting
// coordinates are stable across builds.
//
// To add a new roadmap: drop a JSON file in `src/data/roadmaps/`. Optionally
// author one Markdown file per node in
// `src/content/roadmap-nodes/<roadmap-id>/<node-id>.md` for the right-panel
// content; missing files fall back to a "no notes yet" message.

import dagre from "@dagrejs/dagre";

export type NodeType = "primary" | "optional" | "header";

export type RoadmapGroup = {
  id: string;
  title: string;
};

export type RoadmapNode = {
  id: string;
  title: string;
  /** Optional one-line subtitle shown under the title on the canvas. */
  subtitle?: string;
  groupId?: string;
  type?: NodeType;
  /** IDs of nodes this one connects *to* (directed edges). */
  connections?: string[];
};

export type RoadmapLayoutOptions = {
  /** Top-to-bottom (default) or left-to-right. */
  rankdir?: "TB" | "LR";
  nodesep?: number;
  ranksep?: number;
  edgesep?: number;
  /** Width / height applied to every node unless overridden. */
  nodeWidth?: number;
  nodeHeight?: number;
};

export type Roadmap = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  layout: Required<RoadmapLayoutOptions>;
  groups: RoadmapGroup[];
  nodes: RoadmapNode[];
};

const DEFAULT_LAYOUT: Required<RoadmapLayoutOptions> = {
  rankdir: "TB",
  nodesep: 40,
  ranksep: 70,
  edgesep: 20,
  nodeWidth: 220,
  nodeHeight: 64,
};

const modules = import.meta.glob<{ default: Partial<Roadmap> }>(
  "../data/roadmaps/*.json",
  { eager: true }
);

function slugFromPath(p: string): string {
  return p.split("/").pop()!.replace(/\.json$/, "");
}

export const roadmaps: Roadmap[] = Object.entries(modules)
  .map(([filePath, mod]) => {
    const raw = mod.default;
    const id = (raw.id || slugFromPath(filePath)).trim();
    if (!raw.title) throw new Error(`Roadmap ${filePath} missing "title"`);
    if (!Array.isArray(raw.nodes) || raw.nodes.length === 0) {
      throw new Error(`Roadmap ${filePath} missing non-empty "nodes" array`);
    }

    const nodeIds = new Set<string>();
    for (const n of raw.nodes as RoadmapNode[]) {
      if (!n.id) throw new Error(`Roadmap ${filePath} has a node missing "id"`);
      if (nodeIds.has(n.id)) {
        throw new Error(`Roadmap ${filePath} has duplicate node id "${n.id}"`);
      }
      nodeIds.add(n.id);
    }
    for (const n of raw.nodes as RoadmapNode[]) {
      for (const c of n.connections ?? []) {
        if (!nodeIds.has(c)) {
          throw new Error(
            `Roadmap ${filePath} node "${n.id}" connects to unknown id "${c}"`
          );
        }
      }
    }

    return {
      id,
      title: raw.title,
      description: raw.description ?? "",
      tags: raw.tags ?? [],
      layout: { ...DEFAULT_LAYOUT, ...(raw.layout ?? {}) },
      groups: raw.groups ?? [],
      nodes: raw.nodes as RoadmapNode[],
    } satisfies Roadmap;
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export function getRoadmapById(id: string): Roadmap | undefined {
  return roadmaps.find((r) => r.id === id);
}

export type LaidOutNode = {
  id: string;
  title: string;
  subtitle?: string;
  type: NodeType;
  groupId?: string;
  /** Top-left corner. */
  x: number;
  y: number;
  w: number;
  h: number;
};

export type LaidOutEdge = {
  from: string;
  to: string;
  /** Polyline points (in container coordinates) for SVG <path>. */
  points: { x: number; y: number }[];
};

export type LaidOutCluster = {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type RoadmapLayout = {
  width: number;
  height: number;
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  clusters: LaidOutCluster[];
};

const PADDING = 24; // padding around the whole canvas
const CLUSTER_PAD = 18; // padding around groups

export function layoutRoadmap(rm: Roadmap): RoadmapLayout {
  const g = new dagre.graphlib.Graph({ compound: true, multigraph: false });
  g.setGraph({
    rankdir: rm.layout.rankdir,
    nodesep: rm.layout.nodesep,
    ranksep: rm.layout.ranksep,
    edgesep: rm.layout.edgesep,
    marginx: PADDING,
    marginy: PADDING,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Clusters first so child assignment works.
  for (const grp of rm.groups) {
    g.setNode(grp.id, { label: grp.title, clusterLabelPos: "top" });
  }

  for (const n of rm.nodes) {
    g.setNode(n.id, {
      label: n.title,
      width: rm.layout.nodeWidth,
      height: rm.layout.nodeHeight,
    });
    if (n.groupId) {
      // Skip if the referenced group doesn't exist (silent — validated above optionally).
      if (rm.groups.find((gr) => gr.id === n.groupId)) {
        g.setParent(n.id, n.groupId);
      }
    }
  }

  for (const n of rm.nodes) {
    for (const target of n.connections ?? []) {
      g.setEdge(n.id, target);
    }
  }

  dagre.layout(g);

  const laidOutNodes: LaidOutNode[] = rm.nodes.map((n) => {
    const dn = g.node(n.id) as { x: number; y: number; width: number; height: number };
    return {
      id: n.id,
      title: n.title,
      subtitle: n.subtitle,
      type: n.type ?? "primary",
      groupId: n.groupId,
      x: dn.x - dn.width / 2,
      y: dn.y - dn.height / 2,
      w: dn.width,
      h: dn.height,
    };
  });

  const laidOutEdges: LaidOutEdge[] = [];
  for (const n of rm.nodes) {
    for (const target of n.connections ?? []) {
      const e = g.edge(n.id, target) as { points?: { x: number; y: number }[] } | undefined;
      const points = e?.points?.map((p) => ({ x: p.x, y: p.y })) ?? [];
      laidOutEdges.push({ from: n.id, to: target, points });
    }
  }

  const laidOutClusters: LaidOutCluster[] = rm.groups.map((grp) => {
    // dagre stores cluster bounds on the cluster node after layout.
    const dn = g.node(grp.id) as
      | { x: number; y: number; width: number; height: number }
      | undefined;
    if (!dn) return { id: grp.id, title: grp.title, x: 0, y: 0, w: 0, h: 0 };
    return {
      id: grp.id,
      title: grp.title,
      x: dn.x - dn.width / 2 - CLUSTER_PAD / 2,
      y: dn.y - dn.height / 2 - CLUSTER_PAD / 2,
      w: dn.width + CLUSTER_PAD,
      h: dn.height + CLUSTER_PAD,
    };
  });

  const graph = g.graph() as { width?: number; height?: number };
  return {
    width: Math.ceil(graph.width ?? 0),
    height: Math.ceil(graph.height ?? 0),
    nodes: laidOutNodes,
    edges: laidOutEdges,
    clusters: laidOutClusters,
  };
}
