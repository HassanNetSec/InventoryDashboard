'use client'

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [addingCategory, setAddingCategory] = useState(false);
    const [editingCategoryLoading, setEditingCategoryLoading] = useState(false);

    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);

    const [newCategoryName, setNewCategoryName] = useState({ name: "" });
    const [editingCategory, setEditingCategory] = useState(null); // { id, name } or null

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            setError(null);

            const response = await axios.get("http://localhost:8000/api/categories");

            if (response.status !== 200) {
                throw new Error("Failed to fetch categories");
            }

            const data = response.data;

            setCategories(data);
            // No toast on empty list to avoid spam
            if (data.length > 0) toast.success("Categories loaded successfully.");
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("An error occurred while fetching categories.");
            toast.error("An error occurred while fetching categories.");
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Add a new category
    const addCategory = async () => {
        if (!newCategoryName.name.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            setAddingCategory(true);
            setActionError(null);

            await axios.post("http://localhost:8000/api/addcategories", {
                name: newCategoryName.name.trim(),
            });

            toast.success("Category added successfully!");
            setNewCategoryName({ name: "" }); // reset input
            fetchCategories();
        } catch (e) {
            console.error("Add category error:", e);
            toast.error(e.response?.data?.detail || "Failed to add category");
            setActionError(e.response?.data?.detail || e.message);
        } finally {
            setAddingCategory(false);
        }
    };

    // Start editing a category
    // Start editing a category
    const startEdit = (category) => {
        setEditingCategory({
            id: category.id,
            new_category: category.name,
            old_category: category.name,
        });
        setActionError(null);
    };

    // Save the edited category
    const saveEdit = async () => {
        if (!editingCategory.new_category.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }
        try {
            setEditingCategoryLoading(true);
            setActionError(null);

            await axios.post("http://localhost:8000/api/editcategories", {
                category_old_name: editingCategory.old_category,
                category_new_name: editingCategory.new_category.trim(),
            });

            toast.success("Category updated successfully!");
            setEditingCategory(null);
            fetchCategories();
        } catch (e) {
            console.error("Edit category error:", e);
            setActionError(e.response?.data?.detail || e.message);
            toast.error(e.response?.data?.detail || "Failed to update category");
        } finally {
            setEditingCategoryLoading(false);
        }
    };

    // Cancel editing
    const cancelEdit = () => setEditingCategory(null);

    // Delete category with confirmation
    const deleteCategory = async (name) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            setActionError(null);


            const res = await axios.delete(`http://localhost:8000/api/deletecategories`, {
                params: { name_of_category: name }
            });

            toast.success("Category deleted successfully!");
            fetchCategories();
        } catch (e) {
            console.error("Delete category error:", e);
            setActionError(e.response?.data?.detail || e.message);
            toast.error(e.response?.data?.detail || "Failed to delete category");
        }
    };

    return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-2xl rounded-3xl border border-gray-200">
    <h1 className="text-4xl font-bold mb-6 text-gray-800 tracking-tight">📁 Category Management</h1>
    <Toaster position="top-right" />

    {/* New Category Input */}
    <div className="mb-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <input
            type="text"
            placeholder="Enter new category name"
            value={newCategoryName.name}
            onChange={(e) => setNewCategoryName({ name: e.target.value })}
            className="w-full sm:flex-grow border border-gray-300 px-5 py-3 rounded-xl text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            disabled={addingCategory}
        />
        <button
            onClick={addCategory}
            disabled={addingCategory}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white transition duration-300 ${
                addingCategory
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 shadow-md"
            }`}
        >
            {addingCategory ? "Adding..." : "Add"}
        </button>
    </div>

    {/* Show loading / error */}
    {loadingCategories && <p className="text-gray-500 mb-4">Loading categories...</p>}
    {error && <p className="text-red-600 mb-4">{error}</p>}
    {actionError && <p className="text-red-600 mb-4">{actionError}</p>}

    {/* Category Table */}
    <div className="overflow-x-auto rounded-2xl border border-gray-300 shadow-md">
        <table className="w-full table-auto text-left text-gray-700">
            <thead className="bg-gray-50 text-sm font-semibold text-gray-600">
                <tr>
                    <th className="px-6 py-4 border-b">Category Name</th>
                    <th className="px-6 py-4 text-center border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
                {categories.length === 0 && !loadingCategories && (
                    <tr>
                        <td colSpan={2} className="text-center py-6 text-gray-500">
                            No categories found.
                        </td>
                    </tr>
                )}
                {categories.map((cat, index) => (
                    <tr
                        key={cat.id}
                        className={`transition duration-200 hover:bg-gray-100 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                    >
                        <td className="px-6 py-4 font-medium text-gray-900">
                            {editingCategory && editingCategory.id === cat.id ? (
                                <input
                                    type="text"
                                    value={editingCategory.new_category}
                                    onChange={(e) =>
                                        setEditingCategory({ ...editingCategory, new_category: e.target.value })
                                    }
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={editingCategoryLoading}
                                />
                            ) : (
                                cat.name
                            )}
                        </td>
                        <td className="px-6 py-4 text-center">
                            {editingCategory && editingCategory.id === cat.id ? (
                                <div className="space-x-2">
                                    <button
                                        onClick={saveEdit}
                                        disabled={editingCategoryLoading}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition shadow-sm"
                                    >
                                        {editingCategoryLoading ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        disabled={editingCategoryLoading}
                                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-2">
                                    <button
                                        onClick={() => startEdit(cat)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition shadow-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(cat.name)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>


    );
}
