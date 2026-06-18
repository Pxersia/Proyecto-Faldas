package cl.pxersia.faldascustom.mapper;

import cl.pxersia.faldascustom.dto.PaymentMethodRequest;
import cl.pxersia.faldascustom.dto.PaymentMethodResponse;
import cl.pxersia.faldascustom.entity.PaymentMethod;
import cl.pxersia.faldascustom.entity.User;
import org.springframework.stereotype.Component;

@Component
public class PaymentMethodMapper {

    public PaymentMethod toEntity(PaymentMethodRequest request, User user) {
        String masked = request.getCardNumber().substring(request.getCardNumber().length() - 4);
        return PaymentMethod.builder()
                .user(user)
                .cardHolder(request.getCardHolder())
                .maskedNumber(masked)
                .type(request.getType())
                .build();
    }

    public PaymentMethodResponse toResponse(PaymentMethod method) {
        return PaymentMethodResponse.builder()
                .id(method.getId())
                .cardHolder(method.getCardHolder())
                .maskedNumber("****" + method.getMaskedNumber())
                .type(method.getType())
                .build();
    }
}

