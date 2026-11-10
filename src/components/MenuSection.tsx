import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, FoodCategory, FoodType } from '../types';
import { Search, Clock, Plus, Minus, Check, Sparkles, AlertCircle } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const { menuItems, isLoadingMenu, cart, addToCart, updateQuantity, isCartOpen, setIsCartOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [foodTypeFilter, setFoodTypeFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [priceSort, setPriceSort] = useState<'DEFAULT' | 'LOW_TO_HIGH' | 'HIGH_TO_LOW'>('DEFAULT');

  const categories: (string | FoodCategory)[] = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (foodTypeFilter !== 'ALL') {
      result = result.filter((item) => item.foodType === foodTypeFilter);
    }

    if (priceSort === 'LOW_TO_HIGH') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'HIGH_TO_LOW') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [menuItems, searchQuery, selectedCategory, foodTypeFilter, priceSort]);

  const getItemQuantity = (itemId: string) => {
    const found = cart.find((i) => i.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Canteen Menu & Today's Specials
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Freshly prepared meals, snacks, and beverages for pickup at BMSIT canteen counter.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dosa, thali, coffee..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs / Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-8">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dietary and Price Controls */}
        <div className="flex items-center gap-2">
          {/* Dietary Toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-700/80 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-600">
            <button
              onClick={() => setFoodTypeFilter('ALL')}
              className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                foodTypeFilter === 'ALL'
                  ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFoodTypeFilter('VEG')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                foodTypeFilter === 'VEG'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setFoodTypeFilter('NON_VEG')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                foodTypeFilter === 'NON_VEG'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Price Sorter */}
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-600 rounded-lg cursor-pointer focus:outline-none"
          >
            <option value="DEFAULT">Sort: Featured</option>
            <option value="LOW_TO_HIGH">Price: Low to High</option>
            <option value="HIGH_TO_LOW">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoadingMenu && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse h-80"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingMenu && filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            No food items matched your search
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Try adjusting your search keywords or switching filters back to All.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setFoodTypeFilter('ALL');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Food Cards Grid */}
      {!isLoadingMenu && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id);

            return (
              <div
                key={item.id}
                className={`flex flex-col bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group ${
                  !item.isAvailable || item.stockQuantity <= 0 ? 'opacity-65' : ''
                }`}
              >
                {/* Card Media with Fallback Container */}
                <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback gradient if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Dietary Indicator (Veg / Non-Veg stamp) */}
                  <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-1 rounded-md shadow-xs">
                    {item.foodType === 'VEG' ? (
                      <div
                        className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center rounded-xs"
                        title="Pure Vegetarian"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </div>
                    ) : (
                      <div
                        className="w-3.5 h-3.5 border-2 border-rose-600 flex items-center justify-center rounded-xs"
                        title="Non-Vegetarian"
                      >
                        <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-600" />
                      </div>
                    )}
                  </div>

                  {/* Estimated Prep Time */}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-950/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span className="font-mono tabular-nums">{item.preparationTime} mins</span>
                  </div>

                  {/* Featured / Special Stamp */}
                  {item.isFeatured && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Today's Special</span>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Unboxed Metadata (Anti-slop rule) */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">Stock: {item.stockQuantity}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-400 block -mb-0.5">Price</span>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Add to Cart or Stepper */}
                    {!item.isAvailable || item.stockQuantity <= 0 ? (
                      <span className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-md">
                        Sold Out
                      </span>
                    ) : quantity === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="flex items-center bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono text-emerald-900 dark:text-emerald-100 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
