import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div>
      <PageHeader title="Page not found" description="That route is not part of the Trailblazex HRMS frontend." />
      <Button asChild>
        <Link to="/">Return to dashboard</Link>
      </Button>
    </div>
  );
}
