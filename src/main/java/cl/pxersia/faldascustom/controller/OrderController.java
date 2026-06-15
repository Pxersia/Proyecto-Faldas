package cl.pxersia.faldascustom.controller;

import cl.pxersia.faldascustom.dto.OrderRequest;
import cl.pxersia.faldascustom.dto.OrderResponse;
import cl.pxersia.faldascustom.entity.User;
import cl.pxersia.faldascustom.service.OrderService;
import cl.pxersia.faldascustom.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtils securityUtils;

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody OrderRequest request) {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request, user));
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(orderService.findByUser(user));
    }
}

