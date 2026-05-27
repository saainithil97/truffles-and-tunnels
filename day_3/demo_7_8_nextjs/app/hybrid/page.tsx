import RestaurantSearch from "@/components/RestaurantSearch";
import { restaurants } from "@/lib/restaurants";

// SERVER component (the page shell). It renders the heading and passes the full
// restaurant list to a CLIENT search component. The server does the HTML; the
// client adds interactivity only where it's needed.
export default function HybridPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">/hybrid — Server grid + client search</h1>
      <p className="mt-1 max-w-2xl text-slate-600">
        View Source: the search box <em>and</em> every restaurant card are in the HTML —
        all server-rendered. Typing filters the list (that needs JavaScript). Click any
        card to navigate without a full page reload (Demo 8.5).
      </p>
      <div className="mt-6">
        <RestaurantSearch restaurants={restaurants} />
      </div>
    </div>
  );
}
