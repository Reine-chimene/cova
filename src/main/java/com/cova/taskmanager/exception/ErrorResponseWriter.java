package com.cova.taskmanager.exception;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public final class ErrorResponseWriter {

    private ErrorResponseWriter() {
    }

    public static void write(HttpServletResponse response, ErrorResponse body) throws IOException {
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String json = toJson(body);
        response.getOutputStream().write(json.getBytes(StandardCharsets.UTF_8));
    }

    private static String toJson(ErrorResponse body) {
        StringBuilder sb = new StringBuilder();
        sb.append('{');
        sb.append("\"timestamp\":\"").append(body.getTimestamp()).append("\",");
        sb.append("\"status\":").append(body.getStatus()).append(',');
        sb.append("\"error\":\"").append(escape(body.getError())).append("\",");
        sb.append("\"message\":\"").append(escape(body.getMessage())).append('"');
        if (body.getFieldErrors() != null && !body.getFieldErrors().isEmpty()) {
            sb.append(",\"fieldErrors\":{");
            boolean first = true;
            for (var entry : body.getFieldErrors().entrySet()) {
                if (!first) {
                    sb.append(',');
                }
                first = false;
                sb.append('"').append(escape(entry.getKey())).append("\":");
                sb.append('"').append(escape(entry.getValue())).append('"');
            }
            sb.append('}');
        }
        sb.append('}');
        return sb.toString();
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
