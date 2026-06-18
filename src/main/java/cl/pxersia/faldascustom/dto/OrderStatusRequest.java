package cl.pxersia.faldascustom.dto;

import cl.pxersia.faldascustom.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusRequest {

    @NotNull(message = "El estado es obligatorio")
    private OrderStatus status;
}

