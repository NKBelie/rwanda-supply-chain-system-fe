"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormTemplate } from "@/components/layouts";
import { InputField, TextareaField, SelectField } from "@/components/forms";
import { LocationSelector } from "@/components/common";
import { useSession } from "@/lib/auth/session";

export default function AddProductPage() {
  const router = useRouter();
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "kg",
    price: "",
    quality: "A",
    description: "",
    harvestDate: "",
    expiryDate: "",
  });

  const [location, setLocation] = useState({
    provinceId: "",
    districtId: "",
    sectorId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      const newProduct = {
        ...formData,
        farmerId,
        location,
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        status: "Available",
        createdAt: new Date().toISOString(),
      };

      console.log("Creating product:", newProduct);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to products list
      router.push("/farmer/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
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

  return (
    <FormTemplate
      title="Add New Product"
      subtitle="List a new product to make it available for buyers"
      backUrl="/farmer/products"
      onSubmit={handleSubmit}
      submitLabel="Create Product"
      isSubmitting={isSubmitting}
      error={error}
      sections={[
        {
          title: "Basic Information",
          description: "Provide the essential details about your product",
          columns: 2,
          children: (
            <>
              <InputField
                name="name"
                label="Product Name"
                placeholder="e.g., Arabica Coffee Beans"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <SelectField
                name="category"
                label="Category"
                options={categories}
                placeholder="Select category"
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
                placeholder="e.g., 500"
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
                placeholder="e.g., 2500"
                value={formData.price}
                onChange={handleChange}
                required
                hint="Enter price in Rwandan Francs"
              />

              <SelectField
                name="quality"
                label="Quality Grade"
                options={qualityGrades}
                value={formData.quality}
                onChange={handleChange}
                required
              />
            </>
          ),
        },
        {
          title: "Description",
          description: "Describe your product to attract buyers",
          children: (
            <TextareaField
              name="description"
              label="Product Description"
              placeholder="Describe your product, cultivation methods, certifications, etc."
              rows={5}
              value={formData.description}
              onChange={handleChange}
              hint="Include details that make your product stand out"
            />
          ),
        },
        {
          title: "Location",
          description: "Where is this product available?",
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
        {
          title: "Dates",
          description: "Important dates for your product",
          columns: 2,
          children: (
            <>
              <InputField
                name="harvestDate"
                label="Harvest Date"
                type="date"
                value={formData.harvestDate}
                onChange={handleChange}
                hint="When was this product harvested?"
              />

              <InputField
                name="expiryDate"
                label="Expiry Date (Optional)"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                hint="If applicable, when does this product expire?"
              />
            </>
          ),
        },
      ]}
    />
  );
}
