import { useState } from "react";
import { Mail } from "lucide-react";

import {
  NewsletterSignup,
  NewsletterSignupConfirmation,
} from "@/components/site/NewsletterSignup";
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
  const [open, setOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const [brevoSynced, setBrevoSynced] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setComplete(false);
          setBrevoSynced(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline-inverse" size="sm" className="mt-5">
          <Mail className="size-4" aria-hidden />
          Join our newsletter
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`max-h-[90vh] overflow-y-auto sm:max-w-md ${complete ? "bg-purple-deep text-purple-foreground" : ""}`}
      >
        {complete ? (
          <>
            <DialogTitle className="sr-only">
              Newsletter signup complete
            </DialogTitle>
            <NewsletterSignupConfirmation dialog brevoSynced={brevoSynced} />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-purple">
                Get WLI updates
              </DialogTitle>
              <DialogDescription>
                Occasional news, resources and updates from Wisdom Leadership
                Initiatives.
              </DialogDescription>
            </DialogHeader>
            <NewsletterSignup
              dialog
              onSuccess={(synced) => {
                setBrevoSynced(synced);
                setComplete(true);
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
