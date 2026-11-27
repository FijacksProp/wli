import { Mail } from "lucide-react";

import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function FooterNewsletterSignup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline-inverse" size="sm" className="mt-5">
          <Mail className="size-4" aria-hidden />
          Join our newsletter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-purple">
            Get WLI updates
          </DialogTitle>
          <DialogDescription>
            Occasional news, resources and updates from Wisdom Leadership
            Initiatives.
          </DialogDescription>
        </DialogHeader>
        <NewsletterSignup dialog />
      </DialogContent>
    </Dialog>
  );
}
