"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, MapPin, Calendar, DollarSign, Layers, Star } from "lucide-react";
import { DetailPageTemplate } from "@/components/layouts";
import { productService, userService } from "@/services/data.service";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get product (in real app, this would be from API)
  const product = productService.getById(id);

  if (!product) {
    return (
      <DetailPageTemplate
        title="Product Not Found"
        error="The product you're looking for doesn't exist or has been removed."
        backUrl="/farmer/products"
      />
    );
  }

  const farmer = userService.getUserName(product.farmerId);
  
  // Product interface doesn't have location properties
  // const locationHierarchy = getFullLocationHierarchy(
  //   undefined,
  //   product.districtId,
  //   undefined
  // );

  const handleEdit = () => {
    router.push(`/farmer/products/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      // In real app, call delete API
      console.log("Deleting product:", id);
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push("/farmer/products");
    } catch (error) {
      alert("Failed to delete product");
      setIsDeleting(false);
    }
  };

  return (
    <DetailPageTemplate
      title={product.name}
      subtitle={`Product ID: ${product.id}`}
      backUrl="/farmer/products"
      status={product.status}
      onEdit={handleEdit}
      onDelete={isDeleting ? undefined : handleDelete}
      metadata={[
        {
          label: "Category",
          value: product.category,
          icon: <Package className="h-5 w-5" />,
        },
        {
          label: "Available Quantity",
          value: `${product.quantity} ${product.unit}`,
          icon: <Layers className="h-5 w-5" />,
        },
        {
          label: "Price",
          value: `RWF ${product.price.toLocaleString()}/${product.unit}`,
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          label: "Quality Grade",
          value: product.quality,
          icon: <Star className="h-5 w-5" />,
        },
      ]}
      sections={[
        {
          title: "Description",
          children: (
            <div className="prose dark:prose-invert max-w-none">
              {product.description ? (
                <p className="text-muted-foreground">{product.description}</p>
              ) : (
                <p className="text-muted-foreground italic">No description provided</p>
              )}
            </div>
          ),
        },
        {
          title: "Location & Availability",
          children: (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">
                    Location information not available
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString("en-RW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Farmer Information",
          children: (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">Farmer Name</p>
                <p className="text-sm text-muted-foreground">{farmer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Farmer ID</p>
                <p className="text-sm text-muted-foreground">{product.farmerId}</p>
              </div>
            </div>
          ),
        },
        {
          title: "Product Statistics",
          children: (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface/50 p-4">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  RWF {(product.price * product.quantity).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface/50 p-4">
                <p className="text-sm text-muted-foreground">Created Date</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface/50 p-4">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {product.updatedAt
                    ? new Date(product.updatedAt).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
