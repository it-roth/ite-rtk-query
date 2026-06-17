"use client";

import ProductTable from "@/components/ProductTable";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-10">
      <main className="mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Products</h1>
        <p className="mt-2 text-zinc-600">Browse products with pagination, sorting, search, and modal view.</p>

        <div className="mt-6">
          <ProductTable />
        </div>
      </main>
    </div>
  );
}
