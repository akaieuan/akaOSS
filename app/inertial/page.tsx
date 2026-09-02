import { permanentRedirect } from "next/navigation";

/**
 * The exhibits used to live here, with the essay linking across to them. That
 * split was an artefact of how the post was built, not an editorial decision:
 * a demonstration belongs at the point in the argument that earns it, not on a
 * page the reader has to be sent to. They now render inline in the piece, and
 * this path forwards to it so any existing link still lands somewhere true.
 */
export default function InertialExhibitsPage() {
  permanentRedirect("/research/006-signals-not-verdicts");
}
