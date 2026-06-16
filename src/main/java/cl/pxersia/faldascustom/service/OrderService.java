package cl.pxersia.faldascustom.service;

import cl.pxersia.faldascustom.dto.OrderRequest;
import cl.pxersia.faldascustom.dto.OrderResponse;
import cl.pxersia.faldascustom.dto.OrderStatusRequest;
import cl.pxersia.faldascustom.entity.*;
import cl.pxersia.faldascustom.exception.BusinessException;
import cl.pxersia.faldascustom.exception.ResourceNotFoundException;
import cl.pxersia.faldascustom.mapper.OrderMapper;
import cl.pxersia.faldascustom.repository.OrderRepository;
import cl.pxersia.faldascustom.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse create(OrderRequest request, User user) {
        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (var itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + itemReq.getProductId()));

            if (!product.getActive()) {
                throw new BusinessException("El producto '" + product.getName() + "' no está disponible");
            }
            if (product.getStock() < itemReq.getQuantity()) {
                throw new BusinessException("Stock insuficiente para: " + product.getName());
            }

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(lineTotal);

            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            items.add(OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(product.getPrice())
                    .build());
        }

        Order order = Order.builder()
                .user(user)
                .total(total)
                .status(OrderStatus.PENDING)
                .build();

        items.forEach(item -> item.setOrder(order));
        order.setItems(items);

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findByUser(User user) {
        return orderRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con id: " + id));
        order.setStatus(request.getStatus());
        return orderMapper.toResponse(orderRepository.save(order));
    }
}

