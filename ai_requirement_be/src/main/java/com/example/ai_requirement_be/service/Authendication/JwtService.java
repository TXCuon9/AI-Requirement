package com.example.ai_requirement_be.service.Authendication;

import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.service.User.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {
    // Tự động đọc giá trị từ file application.properties và gán vào đây
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-expiration}")
    private long accessTokenExpireTime;
    @Value("${jwt.refresh-expiration}")
    private long refreshTokenExpireTime;

    private Key getSingingKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // 1. Sinh ra Acess Token (Có chứa Role)
    public String generateToken(User user) {
        Map<String , Object> claims = new HashMap<>();
        claims.put("role", user.getRole());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpireTime))

                // Sử dụng biến expirationTime động
                .signWith(getSingingKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    // 2. Sinh ra Refesh Token (không cần quyền , sống lâu hơn)
      public String generateRefreshToken(User user) {
         return Jwts.builder()
                 .setSubject(user.getEmail())
                 .setIssuedAt(new Date(System.currentTimeMillis()))
                 .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpireTime))
                 .signWith(getSingingKey() , SignatureAlgorithm.HS256)
                 .compact();
      }

      // 3.Hàm trích xuất Email từ Token (Dùng chung cho cả 2 loại Token)
       public String extractEmail(String token) {
         return Jwts.parserBuilder()
                 .setSigningKey(getSingingKey())
                 .build().parseClaimsJws(token).getBody().getSubject();
           //   .setSigningKey(getSingingKey()) -> Kiểm tra xem token có bị sửa không -> sửa tung exception
           //   .getBody() trả về Claim (payload)  -> gồm sub , role , iat , exp
           //  .getSubject() trả về thằng email
       }
       // 4. Kiểm tra Token hợp lệ ( Chưa hết và khớp email)
    public boolean isTokenValid(String token , String email) {
        String extractedEmail = extractEmail(token); // giải mã token
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }
    // 5. Kiểm tra token đã hết hạn hay chưa
    public boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(getSingingKey())
                .build()
                .parseClaimsJws(token)
                .getBody().
                getExpiration();
        return expiration.before(new Date());
        // exp = Expiration
        // Time hời điểm token HẾT HẠN, được tính bằng số giây kể từ 01/01/1970 (Unix timestamp)
    }


}
