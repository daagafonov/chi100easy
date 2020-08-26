package ua.chi100easy.api.exception;

/**
 * @author exdag
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException() {
        super("Object not found");
    }

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
