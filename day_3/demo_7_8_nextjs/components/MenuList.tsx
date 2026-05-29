import { groupBySection, type MenuItem } from "@/lib/menu";
import AddToCartButton from "@/components/AddToCartButton";

// SERVER component. Renders the full menu grouped into sections.
// Zero JavaScript ships for the list itself.
//
// When `withAddToCart` is true, each row gets an <AddToCartButton/> island —
// the only client JS in the tree. Used by /detail; /menu leaves it false.
//
// Each row carries `data-menu-item` + `data-menu-name` so the (separate)
// MenuSearchIsland can filter via DOM toggle without re-rendering the list.
export default function MenuList({
  items,
  withAddToCart = false,
}: {
  items: MenuItem[];
  withAddToCart?: boolean;
}) {
  const grouped = groupBySection(items);
  if (grouped.length === 0) {
    return <p className="text-slate-500">No dishes available.</p>;
  }
  return (
    <div className="space-y-8" data-menu-root>
      {grouped.map((group) => (
        <section key={group.section} data-menu-section={group.section}>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            {group.section}
          </h2>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li
                key={item.id}
                data-menu-item
                data-menu-name={item.name.toLowerCase()}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-200 text-3xl">
                  {item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    {item.isBestseller && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                        Bestseller
                      </span>
                    )}
                    {item.isSpicy && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700">
                        🌶️ Spicy
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  <p className="mt-1 font-mono text-sm text-slate-900">₹{item.price}</p>
                </div>
                {withAddToCart && (
                  <div className="self-center">
                    <AddToCartButton item={item} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
