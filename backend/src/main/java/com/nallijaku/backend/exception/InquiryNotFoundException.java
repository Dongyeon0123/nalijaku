package com.nallijaku.backend.exception;

/**
 * 문의를 찾을 수 없을 때 발생하는 예외
 */
public class InquiryNotFoundException extends RuntimeException {
    
    public InquiryNotFoundException(String message) {
        super(message);
    }
    
    public InquiryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}