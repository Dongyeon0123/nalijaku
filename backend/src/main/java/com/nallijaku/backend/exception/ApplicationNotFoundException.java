package com.nallijaku.backend.exception;

/**
 * 지원서를 찾을 수 없을 때 발생하는 예외
 */
public class ApplicationNotFoundException extends RuntimeException {
    
    public ApplicationNotFoundException(String message) {
        super(message);
    }
    
    public ApplicationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}