'use client';
// now again signUP and add product 
import {
  PlusCircle,
  XCircle,
  ClipboardList,
  Image as ImageIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductFilter from '../product_imp_components/filter';
import ProductSort from '../product_imp_components/sort';

import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';


const isAdmin = true;

export default function ProductList() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [addingProduct, setAddingProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // New product form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Filter and sort states
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [ascending, setAscending] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get('http://localhost:8000/api/categories');

      if (response.status !== 200) throw new Error('Failed to fetch categories');

      const data = response.data;
      console.log('data',data);
      
      if (!Array.isArray(data) || data.length === 0) {
        setCategories([]);
        setSelectedCategory('');
        toast('No categories found in the database.', { icon: 'ℹ️' });
      } else {
        setCategories(data);
        setSelectedCategory(data[0].name);
        toast.success('Categories loaded successfully.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('An error occurred while fetching categories.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get('http://localhost:8000/api/products');
      if (response.status !== 200) throw new Error('Failed to fetch products');
      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        setProducts([]);
        toast('No products found in the database.', { icon: 'ℹ️' });
      } else {
        setProducts(data);
        toast.success('Products loaded successfully.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('An error occurred while fetching products.');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) 
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return ascending ? -1 : 1;
      if (aValue > bValue) return ascending ? 1 : -1;
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, query, sortBy, ascending]);

 const handleAddProduct = async (e) => {
  e.preventDefault();

  if (!name.trim() || !price.trim() || !stock.trim() || !selectedCategory) {
    toast.error('Please fill in all required fields.');
    return;
  }

  const token = localStorage.get("token");
  if (!token) {
    toast.error('No authentication token found. Please log in again.');
    return;
  }

  try {
    setAddingProduct(true);

    // ✅ Step 1: Get category_id by selected category name
    const catResponse = await axios.post('http://localhost:8000/api/categories_by_name', {
      name: selectedCategory, // ✅ FIX: Send category name, not product name
    });
    console.log('category_name',catResponse?.data?.id);
    
    const category_id = catResponse?.data?.id;
    if (!category_id) {
      toast.error('Category not found.');
      return;
    }

    // ✅ Step 2: Decode token to get user_id
    const res_user_id = await axios.post("http://localhost:8000/decode_token", {
      token: token
    });

    const user_id = res_user_id?.data?.user_id;
    console.log("user id ",user_id);
    
    
    if (!user_id) {
      toast.error('Invalid or expired token. Please log in again.');
      return;
    }
    let low_stock_threshold = 5
    console.log('name',name);
    console.log('description',description);
    console.log('price',price);
    console.log('stock',stock);
    console.log('imagePreview',imagePreview);
    console.log('user_id',user_id);
    console.log('category_id',category_id);
    console.log('low_stock_threshold',low_stock_threshold);
    
    console.table([name,description,price,stock,imagePreview,user_id,category_id,low_stock_threshold])
    // ✅ Step 3: Add the product
    const response = await axios.post('http://localhost:8000/api/addProduct', {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image_url: imagePreview,
      user_id: user_id,
      category_id: category_id,
      low_stock_threshold : low_stock_threshold
    });

    if (response.status === 201 || response.status === 200) {
      toast.success('Product added successfully!');
      setProducts((prev) => [
        ...prev,
        response.data || { ...newProduct, id: prev.length + 1 },
      ]);

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setSelectedCategory(categories.length > 0 ? categories[0].name : '');
      setImageFile(null);
      setImagePreview(null);
      setShowAddForm(false);
    } else {
      toast.error('Failed to add product.');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    toast.error(error.response?.data?.detail || 'An error occurred while adding the product.');
  } finally {
    setAddingProduct(false);
  }
};


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl border border-gray-200">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold mb-8 text-gray-800 tracking-tight flex items-center gap-3">
        <ClipboardList className="w-8 h-8 text-indigo-600" />
        Product Management
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <ProductFilter query={query} setQuery={setQuery} />
        <ProductSort
          sortBy={sortBy}
          setSortBy={setSortBy}
          ascending={ascending}
          setAscending={setAscending}
        />
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition duration-200 active:scale-95 shadow flex items-center gap-2"
          >
            {showAddForm ? (
              <>
                <XCircle className="w-5 h-5" /> Cancel
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" /> Add Product
              </>
            )}
          </button>
        )}
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddProduct}
          className="mb-10 p-6 rounded-2xl bg-gray-50 shadow-inner space-y-6 border"
        >
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Name *</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
            <textarea
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">Price ($) *</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">Stock *</label>
              <Input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Category *</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={loadingCategories}
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Product Image</label>
            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('imageUpload')?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 flex items-center gap-2"
            >
              <ImageIcon className="w-5 h-5" />
              Choose Image
            </button>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-24 object-contain border rounded-lg"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={addingProduct}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-200 active:scale-95 flex items-center gap-2"
          >
            <ClipboardList className="w-5 h-5" />
            {addingProduct ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-xl text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 border-b border-gray-300">Name</th>
              <th className="p-3 border-b border-gray-300">Price ($)</th>
              <th className="p-3 border-b border-gray-300">Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => alert(`Selected product: ${item.name}`)}
                >
                  <td className="p-3 border-b border-gray-300">{item.name}</td>
                  <td className="p-3 border-b border-gray-300">${item.price.toFixed(2)}</td>
                  <td className="p-3 border-b border-gray-300">{item.stock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500 font-semibold">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
