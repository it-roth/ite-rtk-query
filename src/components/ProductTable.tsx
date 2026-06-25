"use client";

import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetProductsQuery, Product } from "@/services/fakeStoreApi";
import { addToCart, removeFromCart } from "@/features/cartSlice/cartSlice";
import Modal from "./Modal";

const PAGE_SIZES = [5, 10, 20];

function matchSearch(item: Product, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    item.name.toLowerCase().includes(s) ||
    item.category.toLowerCase().includes(s) ||
    item.slug.toLowerCase().includes(s) ||
    String(item.price).toLowerCase().includes(s)
  );
}

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const { data = [], isLoading, isFetching, error } = useGetProductsQuery();

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Product | null>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const items = data.filter((d) => matchSearch(d, search));
    if (sortField) {
      items.sort((a, b) => {
        const av = (a as any)[sortField];
        const bv = (b as any)[sortField];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "string") {
          return sortDir === "asc"
            ? String(av).localeCompare(String(bv))
            : String(bv).localeCompare(String(av));
        }
        return sortDir === "asc" ? av - bv : bv - av;
      });
    }
    return items;
  }, [data, search, sortField, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageIndex = Math.min(Math.max(1, page), totalPages);

  const pageItems = filtered.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search all fields"
            className="w-64 rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2 text-zinc-600"
          />
          <select
            value={String(sortField)}
            onChange={(e) => setSortField(e.target.value as keyof Product)}
            className="rounded-md border border-zinc-100 bg-zinc-50 px-2 py-2 text-zinc-600"
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
            <option value="slug">Slug</option>
          </select>
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2 text-zinc-600"
          >
            {sortDir === "asc" ? "Asc" : "Desc"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600">Per page</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-zinc-100 bg-zinc-50 px-2 py-2 text-zinc-600"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto divide-y">
          <thead>
            <tr className="text-left text-sm text-zinc-600">
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={4} className="p-4 text-zinc-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="p-4 text-red-600">
                  Request failed
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-zinc-500">
                  No results
                </td>
              </tr>
            ) : (
              pageItems.map((p) => (
                <tr key={p.id} className="align-top">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-16 w-16 rounded-md bg-white object-contain p-1"
                      />
                      <div>
                        <div className="text-zinc-700">{p.name}</div>
                        <div className="text-sm text-zinc-500">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-zinc-700">{p.category}</td>
                  <td className="px-3 py-3 text-sm text-zinc-800">${p.price.toFixed(2)}</td>
                  <td className="px-3 py-3 text-sm">
                    <button
                      onClick={() => setSelected(p)}
                      className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-1 text-zinc-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-zinc-600">
          Showing {Math.min(total, (pageIndex - 1) * pageSize + 1)} - {Math.min(total, pageIndex * pageSize)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageIndex === 1}
            className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-1 disabled:opacity-50 text-zinc-600"
          >
            Prev
          </button>
          <div className="text-sm text-zinc-600">{pageIndex} / {totalPages}</div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageIndex === totalPages}
            className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-1 disabled:opacity-50 text-zinc-600"
          >
            Next
          </button>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex flex-col gap-4 md:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.image} alt={selected.name} className="h-40 w-40 object-contain" />
            <div className="flex-1">
              <h3 className="text-lg text-zinc-700">{selected.name}</h3>
              <p className="text-sm text-zinc-600">Category: {selected.category}</p>
              <p className="mt-2 text-xl text-zinc-800">${selected.price.toFixed(2)}</p>
              <p className="mt-4 text-sm text-zinc-700">Slug: {selected.slug}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(addToCart(selected))}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(selected))}
                  className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-rose-700"
                >
                  Remove from cart
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
