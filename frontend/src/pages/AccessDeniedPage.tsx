import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

export function AccessDeniedPage() {
  return (
    <div>
      <PageHeader
        title="Access denied"
        description="Your account cannot open this area. Frontend checks only hide the page; the backend still enforces permissions."
      />
      <Button asChild>
        <Link to="/">Return to dashboard</Link>
      </Button>
    </div>
  );
}
