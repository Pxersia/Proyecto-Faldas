package cl.pxersia.faldascustom.mapper;

import cl.pxersia.faldascustom.dto.OrderItemResponse;
import cl.pxersia.faldascustom.dto.OrderResponse;
import cl.pxersia.faldascustom.entity.Order;
import cl.pxersia.faldascustom.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userEmail(order.getUser().getEmail())
                .items(mapItems(order.getItems()))
                .total(order.getTotal())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }

    private List<OrderItemResponse> mapItems(List<OrderItem> items) {
        return items.stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .toList();
    }
}

