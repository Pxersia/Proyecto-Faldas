package cl.pxersia.faldascustom.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodResponse {

    private Long id;
    private String cardHolder;
    private String maskedNumber;
    private String type;
}

