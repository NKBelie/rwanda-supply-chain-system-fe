"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Package, MapPin, Calendar, DollarSign, Truck } from "lucide-react";
import { DetailPageTemplate } from "@/components/layouts";
import { orderService, productService, userService } from "@/services/data.service";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Get order
  const order = orderService.getById(id);

  if (!order) {
    return (
      <DetailPageTemplate
        title="Order Not Found"
        error="The order you're looking for doesn't exist or has been removed."
        backUrl="/farmer/orders"
      />
    );
  }

  const product = productService.getById(order.productId);
  const buyer = userService.getUserName(order.buyerId);

  return (
    <DetailPageTemplate
      title={`Order #${order.id}`}
      subtitle={`${buyer} • ${new Date(order.createdAt).toLocaleDateString()}`}
      backUrl="/farmer/orders"
      status={order.status}
      metadata={[
        {
          label: "Product",
          value: product?.name || "Unknown Product",
          icon: <Package className="h-5 w-5" />,
        },
        {
          label: "Quantity",
          value: `${order.quantity} ${product?.unit || "units"}`,
          icon: <ShoppingCart className="h-5 w-5" />,
        },
        {
          label: "Total Amount",
          value: `RWF ${order.totalPrice.toLocaleString()}`,
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          label: "Order Date",
          value: new Date(order.createdAt).toLocaleDateString("en-RW"),
          icon: <Calendar className="h-5 w-5" />,
        },
      ]}
      sections={[
        {
          title: "Buyer Information",
          children: (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Buyer Name</p>
                  <p className="text-sm text-muted-foreground">{buyer}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Buyer ID</p>
                  <p className="text-sm text-muted-foreground">{order.buyerId}</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Product Details",
          children: product ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">Product Name</p>
                <p className="text-sm text-muted-foreground">{product.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Category</p>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Quality Grade</p>
                <p className="text-sm text-muted-foreground">{product.quality}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Unit Price</p>
                <p className="text-sm text-muted-foreground">
                  RWF {product.price.toLocaleString()}/{product.unit}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Product information not available</p>
          ),
        },
        {
          title: "Delivery Information",
          children: (
            <div className="space-y-3">
              {order.deliveryAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Delivery Address</p>
                    <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                  </div>
                </div>
              )}
              {order.deliveryDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Expected Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.deliveryDate).toLocaleDateString("en-RW", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
              {order.transportId && (
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Transport ID</p>
                    <p className="text-sm text-muted-foreground">{order.transportId}</p>
                  </div>
                </div>
              )}
            </div>
          ),
        },
        {
          title: "Order Timeline",
          children: (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    ✓
                  </div>
                  <div className="h-full w-0.5 bg-border" />
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-foreground">Order Placed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("en-RW")}
                  </p>
                </div>
              </div>
              
              {order.status !== "Request" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      order.status === "Accepted" || order.status === "Processing" || order.status === "Transport" || order.status === "Completed"
                        ? "bg-emerald-500 text-white"
                        : "bg-surface text-muted-foreground"
                    }`}>
                      {order.status === "Accepted" || order.status === "Processing" || order.status === "Transport" || order.status === "Completed" ? "✓" : "2"}
                    </div>
                    <div className="h-full w-0.5 bg-border" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-foreground">Order Accepted</p>
                    <p className="text-sm text-muted-foreground">
                      {order.updatedAt ? new Date(order.updatedAt).toLocaleString("en-RW") : "Pending"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    order.status === "Completed"
                      ? "bg-emerald-500 text-white"
                      : "bg-surface text-muted-foreground"
                  }`}>
                    {order.status === "Completed" ? "✓" : "3"}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Order Completed</p>
                  <p className="text-sm text-muted-foreground">
                    {order.status === "Completed" && order.updatedAt
                      ? new Date(order.updatedAt).toLocaleString("en-RW")
                      : "Awaiting completion"}
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
