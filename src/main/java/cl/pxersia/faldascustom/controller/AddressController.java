package cl.pxersia.faldascustom.controller;

import cl.pxersia.faldascustom.dto.AddressRequest;
import cl.pxersia.faldascustom.dto.AddressResponse;
import cl.pxersia.faldascustom.entity.User;
import cl.pxersia.faldascustom.service.AddressService;
import cl.pxersia.faldascustom.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAll() {
        return ResponseEntity.ok(addressService.findByUser(securityUtils.getCurrentUser()));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> create(@Valid @RequestBody AddressRequest request) {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.create(request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        addressService.delete(id, securityUtils.getCurrentUser());
        return ResponseEntity.noContent().build();
    }
}

