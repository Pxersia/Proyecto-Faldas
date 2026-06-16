package cl.pxersia.faldascustom.service;

import cl.pxersia.faldascustom.dto.PaymentMethodRequest;
import cl.pxersia.faldascustom.dto.PaymentMethodResponse;
import cl.pxersia.faldascustom.entity.PaymentMethod;
import cl.pxersia.faldascustom.entity.User;
import cl.pxersia.faldascustom.exception.ResourceNotFoundException;
import cl.pxersia.faldascustom.mapper.PaymentMethodMapper;
import cl.pxersia.faldascustom.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMethodMapper paymentMethodMapper;

    @Transactional(readOnly = true)
    public List<PaymentMethodResponse> findByUser(User user) {
        return paymentMethodRepository.findAllByUser(user)
                .stream()
                .map(paymentMethodMapper::toResponse)
                .toList();
    }

    @Transactional
    public PaymentMethodResponse create(PaymentMethodRequest request, User user) {
        PaymentMethod method = paymentMethodMapper.toEntity(request, user);
        return paymentMethodMapper.toResponse(paymentMethodRepository.save(method));
    }

    @Transactional
    public void delete(Long id, User user) {
        PaymentMethod method = paymentMethodRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Método de pago no encontrado con id: " + id));
        paymentMethodRepository.delete(method);
    }
}

