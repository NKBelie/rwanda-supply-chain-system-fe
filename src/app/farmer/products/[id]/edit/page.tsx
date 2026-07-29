"use client";

import { use, useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormTemplate } from "@/components/layouts";
import { InputField, TextareaField, SelectField } from "@/components/forms";
import { LocationSelector } from "@/components/common";
import { productService } from "@/services/data.service";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "kg",
    price: "",
    quality: "A",
    description: "",
    status: "Available",
  });

  const [location, setLocation] = useState({
    provinceId: "",
    districtId: "",
    sectorId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load existing product data
  useEffect(() => {
    const product = productService.getById(id);
    
    if (!product) {
      setError("Product not found");
      setIsLoading(false);
      return;
    }

    setFormData({
      name: product.name,
      category: product.category,
      quantity: String(product.quantity),
      unit: product.unit,
      price: String(product.price),
      quality: product.quality,
      description: product.description || "",
      status: product.status,
    });

    // Product interface doesn't have location properties
    setLocation({
      provinceId: "",
      districtId: "",
      sectorId: "",
    });

    setIsLoading(false);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validation
      if (!location.districtId) {
        setError("Please select a location (at least district)");
        setIsSubmitting(false);
        return;
      }

      // In real app, call API
      const updatedProduct = {
        ...formData,
        location,
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        updatedAt: new Date().toISOString(),
      };

      console.log("Updating product:", id, updatedProduct);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to product detail
      router.push(`/farmer/products/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "Crops", label: "Crops" },
    { value: "Livestock", label: "Livestock" },
    { value: "Dairy", label: "Dairy" },
    { value: "Fruits", label: "Fruits" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Seeds", label: "Seeds" },
  ];

  const units = [
    { value: "kg", label: "Kilograms (kg)" },
    { value: "ton", label: "Tons" },
    { value: "liter", label: "Liters" },
    { value: "piece", label: "Pieces" },
    { value: "bag", label: "Bags" },
    { value: "crate", label: "Crates" },
  ];

  const qualityGrades = [
    { value: "A", label: "Grade A (Premium)" },
    { value: "B", label: "Grade B (Standard)" },
    { value: "C", label: "Grade C (Basic)" },
  ];

  const statuses = [
    { value: "Available", label: "Available" },
    { value: "Growing", label: "Growing" },
    { value: "Harvested", label: "Harvested" },
    { value: "Out of Stock", label: "Out of Stock" },
    { value: "Pending Approval", label: "Pending Approval" },
  ];

  if (isLoading) {
    return (
      <FormTemplate
        title="Edit Product"
        backUrl={`/farmer/products/${id}`}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </FormTemplate>
    );
  }

  if (error && !formData.name) {
    return (
      <FormTemplate
        title="Edit Product"
        backUrl="/farmer/products"
        onSubmit={(e) => e.preventDefault()}
        error={error}
      />
    );
  }

  return (
    <FormTemplate
      title="Edit Product"
      subtitle={`Update details for ${formData.name}`}
      backUrl={`/farmer/products/${id}`}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      isSubmitting={isSubmitting}
      error={error}
      sections={[
        {
          title: "Basic Information",
          columns: 2,
          children: (
            <>
              <InputField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <SelectField
                name="category"
                label="Category"
                options={categories}
                value={formData.category}
                onChange={handleChange}
                required
              />

              <InputField
                name="quantity"
                label="Available Quantity"
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
                required
              />

              <SelectField
                name="unit"
                label="Unit of Measurement"
                options={units}
                value={formData.unit}
                onChange={handleChange}
                required
              />

              <InputField
                name="price"
                label="Price per Unit (RWF)"
                type="number"
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <SelectField
                name="quality"
                label="Quality Grade"
                options={qualityGrades}
                value={formData.quality}
                onChange={handleChange}
                required
              />

              <SelectField
                name="status"
                label="Status"
                options={statuses}
                value={formData.status}
                onChange={handleChange}
                required
              />
            </>
          ),
        },
        {
          title: "Description",
          children: (
            <TextareaField
              name="description"
              label="Product Description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
            />
          ),
        },
        {
          title: "Location",
          children: (
            <LocationSelector
              value={location}
              onChange={(value) => setLocation({
                provinceId: value.provinceId || "",
                districtId: value.districtId || "",
                sectorId: value.sectorId || "",
              })}
              level="sector"
              required
              showLabels
            />
          ),
        },
      ]}
    />
  );
}
