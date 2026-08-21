"""
Bake the Geometry Nodes station down to a mesh and write a web-sized .glb.

    pip install "bpy==4.2.0"          # needs Python 3.11
    python scripts/export_station.py raw.glb
    npx @gltf-transform/cli optimize raw.glb public/models/spacestation.glb \
        --compress draco --texture-compress false

The second step is not optional: this bpy wheel silently ignores the exporter's
Draco flags, and the raw export is 5.5 MB against 423 KB optimised.

The tree's output is instanced and never realised, so a plain bake returns zero
geometry on every Blender version — see the Realize Instances splice below. That
is not a version problem; 4.2 and 5.2 behave identically here.

NOTE: the "Metal" material is procedural (noise -> colour ramp -> Principled).
glTF has no concept of shader nodes, so that detail cannot survive the export
unbaked; it flattens to the Principled base values. The "Emission" material does
survive, as glTF emissive, which is the part that actually matters against a
black background.
"""

import os
import sys

import bpy

BLEND = "/Users/ash/Downloads/spacestation2.blend"
OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/spacestation.glb"
TRI_BUDGET = 45_000


def log(*a):
    print("R_", *a, flush=True)


bpy.ops.wm.open_mainfile(filepath=BLEND)

# The scene's own camera and lights are not wanted: the page lights it.
for o in list(bpy.data.objects):
    if o.type in {"CAMERA", "LIGHT"}:
        bpy.data.objects.remove(o, do_unlink=True)

ob = bpy.data.objects["Space station"]

# The tree ends in two Instance-on-Points branches and never realises them.
# Unrealised instances are invisible to to_mesh() and to the glTF exporter, which
# is why every earlier bake came back empty on both 4.2 and 5.2 — it was never a
# version break. Splice a Realize Instances node in front of the group output.
ng = ob.modifiers["GeometryNodes"].node_group
out_socket = [n for n in ng.nodes if n.type == "GROUP_OUTPUT"][0].inputs[0]
link = out_socket.links[0]
realize = ng.nodes.new("GeometryNodeRealizeInstances")
src = link.from_socket
ng.links.remove(link)
ng.links.new(src, realize.inputs[0])
ng.links.new(realize.outputs[0], out_socket)

bpy.ops.object.select_all(action="DESELECT")
bpy.context.view_layer.objects.active = ob
ob.select_set(True)

bpy.ops.object.convert(target="MESH")
ob = bpy.context.view_layer.objects.active

me = ob.data
me.calc_loop_triangles()
tris = len(me.loop_triangles)
log("BAKED_TRIS", tris, "VERTS", len(me.vertices))

if tris == 0:
    log("EMPTY — node tree produced no geometry on this Blender version")
    sys.exit(2)

# Keep the hero canvas cheap. Collapse is used rather than un-subdivide because
# the station is hard-surface and un-subdivide wrecks the panel edges.
if tris > TRI_BUDGET:
    dec = ob.modifiers.new("web_budget", "DECIMATE")
    dec.decimate_type = "COLLAPSE"
    dec.ratio = TRI_BUDGET / tris
    bpy.ops.object.modifier_apply(modifier=dec.name)
    ob.data.calc_loop_triangles()
    log("DECIMATED_TO", len(ob.data.loop_triangles))

bpy.ops.object.select_all(action="DESELECT")
ob.select_set(True)

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_yup=True,
    export_normals=True,
    export_texcoords=True,
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
    export_animations=False,
    # Draco takes this from ~7 MB to well under one. The decoder is served from
    # the site itself (public/draco/), copied out of the three package, so the
    # page never reaches for a CDN.
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_draco_position_quantization=12,
    export_draco_normal_quantization=8,
    export_draco_texcoord_quantization=10,
)

log("WROTE", OUT, os.path.getsize(OUT), "bytes")
