import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCart } from '@/contexts/CartContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/utils';

export const CartButton = () => {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Cart</h4>
            <span className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          {items.length > 0 ? (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr,auto] gap-4"
                    >
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.artist} • {item.display_name}
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(item.price)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Subtotal</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(total)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Tax (8%)</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(total * 0.08)}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <div className="text-sm font-medium">Total</div>
                  <div className="text-sm font-medium">
                    {formatPrice(total * 1.08)}
                  </div>
                </div>
                <Button onClick={handleCheckout} className="w-full">
                  Checkout
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Your cart is empty
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 