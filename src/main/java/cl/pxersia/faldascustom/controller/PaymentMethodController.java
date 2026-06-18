package cl.pxersia.faldascustom.controller;

import cl.pxersia.faldascustom.dto.PaymentMethodRequest;
import cl.pxersia.faldascustom.dto.PaymentMethodResponse;
import cl.pxersia.faldascustom.entity.User;
import cl.pxersia.faldascustom.service.PaymentMethodService;
import cl.pxersia.faldascustom.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<PaymentMethodResponse>> getAll() {
        return ResponseEntity.ok(paymentMethodService.findByUser(securityUtils.getCurrentUser()));
    }

    @PostMapping
    public ResponseEntity<PaymentMethodResponse> create(@Valid @RequestBody PaymentMethodRequest request) {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMethodService.create(request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paymentMethodService.delete(id, securityUtils.getCurrentUser());
        return ResponseEntity.noContent().build();
    }
}

