namespace java node

struct Gateway {
  1: required string ip,
  2: required string gateway,
  3: required string netmask,
  4: optional i32 thriftPort=9521,
  5: optional string thriftRemoteIp,
  6: optional i32 thriftRemotePort=9522
}

service GatewayService {
  Gateway getGatewayInfo(),
  void updGatewayInfo(1: Gateway gateway),
  bool delGatewayInfo(1: i32 id)
}