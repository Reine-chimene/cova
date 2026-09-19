package com.cova.taskmanager.exception;

public class InvalidJwtException extends RuntimeException {

    public InvalidJwtException() {
        super("Invalid or expired token");
    }

    public InvalidJwtException(String message) {
        super(message);
    }
}
