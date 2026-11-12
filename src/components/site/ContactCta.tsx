import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function ContactCta({ inverse = false }: { inverse?: boolean }) {
  return (
    <Button asChild variant={inverse ? "inverse" : "default"}>
      <Link to="/contact">Contact WLI</Link>
    </Button>
  );
}
