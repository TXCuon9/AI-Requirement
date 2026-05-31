package com.example.ai_requirement_be.security;

import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.IUserRepository;
import com.example.ai_requirement_be.service.Authendication.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private IUserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Kiểm tra header Authorization có chứa Bearer token không
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Trích xuất token
        jwt = authHeader.substring(7);
        try {
            userEmail = jwtService.extractEmail(jwt);
        } catch (Exception e) {
            // Token không hợp lệ
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Nếu lấy được email và chưa có thông tin xác thực trong SecurityContext
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Tìm user trong database
            User user = userRepository.findByEmail(userEmail).orElse(null);

            // 4. Nếu user tồn tại và token hợp lệ
            if (user != null && jwtService.isTokenValid(jwt, userEmail)) {
                
                // Tạo đối tượng xác thực (có chứa quyền của user)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user, 
                        null, 
                        user.getAuthorities()
                );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Cập nhật SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
