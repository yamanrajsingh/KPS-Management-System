package com.school.kps.exception;

import com.school.kps.payload.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> responseNotFoundExceptionHandler(ResourceNotFoundException ex)
    {
      String message = ex.getMessage();

      ApiResponse apiResponse = new ApiResponse(message,false);
      return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
    }
}
