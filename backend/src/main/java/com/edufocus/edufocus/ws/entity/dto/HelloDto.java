package com.edufocus.edufocus.ws.entity.dto;


import lombok.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HelloDto {
    long channelId;
    String name;
}
