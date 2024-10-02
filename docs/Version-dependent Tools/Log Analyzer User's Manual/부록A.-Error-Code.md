# 부록A. Error Code

### Error Code 정리

오류 코드와 발생 원인을 설명한다.

#### FATAL Error

<table>
<tbody>
<tr>
<th>Error Code</th><th>Description</th><th>Can be returned by</th>
</tr>
<tr>
<td>
<p>0x50008</p>
</td>
<td>
<p>Active Transaction을 중복 시작하려고 함</p>
</td>
<td>
<p>ALA_ReceiveXLog<br />ALA_GetXLog</p>
</td>
</tr>
<tr>
<td>
<p>0x5000A</p>
</td>
<td>
<p>Mutex 초기화 실패</p>
</td>
<td>
<p>ALA_CreateXLogCollector<br />ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x5000B</p>
</td>
<td>
<p>Mutex 제거 실패</p>
</td>
<td>
<p>ALA_Handshake<br />ALA_DestroyXLogCollector</p>
</td>
</tr>
<tr>
<td>
<p>0x5000C</p>
</td>
<td>
<p>Mutex Lock 실패</p>
</td>
<td rowspan="2" >
<p>ALA_AddAuthInfo<br />ALA_RemoveAuthInfo<br />ALA_Handshake<br />ALA_ReceiveXLog<br />ALA_GetXLog<br />ALA_SendACK<br />ALA_FreeXLog<br />ALA_DestroyXLogCollector<br />ALA_GetXLogCollectorStatus</p>
</td>
</tr>
<tr>
<td>
<p>0x5000D</p>
</td>
<td>
<p>Mutex Unlock 실패</p>
</td>
</tr>
</tbody>
</table>

#### ABORT Error

<table>
<tbody>
<tr>
<th>Error Code</th><th>Description</th><th>Can be returned by</th></tr>
<tr>
<td>
<p>0x51006</p>
</td>
<td>
<p>Memory Allocation 실패</p>
</td>
<td>
<p>모든 Log Analysis API</p>
</td>
</tr>
<tr>
<td>
<p>0x5101E</p>
</td>
<td>
<p>Pool에서 Memory Allocation 실패</p>
</td>
<td>
<p>ALA_ReceiveXLog</p>
</td>
</tr>
<tr>
<td>
<p>0x5101F</p>
</td>
<td>
<p>Pool에서 Memory Free 실패</p>
</td>
<td>
<p>ALA_Handshake<br />ALA_ReceiveXLog<br />ALA_FreeXLog<br />ALA_DestroyXLogCollector</p>
</td>
</tr>
<tr>
<td>
<p>0x51020</p>
</td>
<td>
<p>Memory Pool 초기화 실패</p>
</td>
<td>
<p>ALA_CreateXLogCollector</p>
</td>
</tr>
<tr>
<td>
<p>0x51021</p>
</td>
<td>
<p>Memory Pool 제거 실패</p>
</td>
<td>
<p>ALA_DestroyXLogCollector</p>
</td>
</tr>
<tr>
<td>
<p>0x51013</p>
</td>
<td>
<p>Network Context 초기화 실패</p>
</td>
<td rowspan="3">
<p>ALA_Handshake<br />ALA_ReceiveXLog<br />ALA_SendACK</p>
</td>
</tr>
<tr>
<td>
<p>0x51019</p>
</td>
<td>
<p>Network Protocol 제거 실패</p>
</td>
</tr>
<tr>
<td>
<p>0x5101A</p>
</td>
<td>
<p>Network Context 종료 실패</p>
</td>
</tr>
<tr>
<td>
<p>0x51017</p>
</td>
<td>
<p>Network Session이 이미 종료</p>
</td>
<td>
<p>ALA_ReceiveXLog<br />ALA_SendACK</p>
</td>
</tr>
<tr>
<td>
<p>0x51018</p>
</td>
<td>
<p>Network Protocol이 이상함</p>
</td>
<td rowspan="2">
<p>ALA_Handshake<br />ALA_ReceiveXLog</p>
</td>
</tr>
<tr>
<td>
<p>0x51016</p>
</td>
<td>
<p>Network Read 실패</p>
</td>
</tr>
<tr>
<td>
<p>0x5101B</p>
</td>
<td>
<p>Network Write 실패</p>
</td>
<td rowspan="2">
<p>ALA_Handshake<br />ALA_SendACK</p>
</td>
</tr>
<tr>
<td>
<p>0x5101C</p>
</td>
<td>
<p>Network Flush 실패</p>
</td>
</tr>
<tr>
<td>
<p>0x51015</p>
</td>
<td>
<p>Network Timeout (네트워크 오류)</p>
</td>
<td>
<p>ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x5102C</p>
</td>
<td>
<p>Network Session 추가 실패</p>
</td>
<td>
<p>ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x51024</p>
</td>
<td>
<p>Protocol Version이 다름</p>
</td>
<td>
<p>ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x51027</p>
</td>
<td>
<p>Link Allocation 실패</p>
</td>
<td>
<p>ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x51028</p>
</td>
<td>
<p>Link Listen 실패</p>
</td>
<td>
<p>ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x51029</p>
</td>
<td>
<p>Link Wait 실패</p>
</td>
<td>
<p>ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x5102A</p>
</td>
<td>
<p>Link Accept 실패</p>
</td>
<td>
<p>ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x5102B</p>
</td>
<td>
<p>Link Set 실패</p>
</td>
<td>
<p>ALA_Handshake</p>
</td>
</tr>
<tr>
<td>
<p>0x51022</p>
</td>
<td>
<p>Link Shutdown 실패</p>
</td>
<td rowspan="2">
<p>ALA_Handshake<br />ALA_DestroyXLogCollector</p>
</td>
</tr>
<tr>
<td>
<p>0x51023</p>
</td>
<td>
<p>Link Free 실패</p>
</td>
</tr>
<tr>
<td>
<p>0x51012</p>
</td>
<td>
<p>Meta Information이 존재하지 않음</p>
</td>
<td>
<p>ALA_Handshake<br />ALA_GetXLog<br />ALA_GetReplicationInfo<br />ALA_GetTableInfo<br />ALA_GetTableInfoByName</p>
</td>
</tr>
<tr>
<td>
<p>0x5103F</p>
</td>
<td>
<p>Table Information이 존재하지 않음</p>
</td>
<td>
<p>ALA_GetXLog</p>
</td>
</tr>
<tr>
<td>
<p>0x51040</p>
</td>
<td>
<p>Column Information이 존재하지 않음</p>
</td>
<td>
<p>ALA_GetXLog</p>
</td>
</tr>
</tbody>
</table>

#### INFO Error

| Error Code | Description                                         | Can be returned by                                           |
| ---------- | --------------------------------------------------- | ------------------------------------------------------------ |
| 0x52034    | Log Analysis API 환경 생성 실패                     | ALA_InitializeAPI                                            |
| 0x52035    | Log Analysis API 환경 제거 실패                     | ALA_DestroyAPI                                               |
| 0x52000    | Log Manager 초기화 실패                             | ALA_EnableLogging                                            |
| 0x52001    | Log File 열기 실패                                  | ALA_EnableLogging                                            |
| 0x52004    | Log Manager Lock 실패                               | 모든 Log Analysis API                                        |
| 0x52005    | Log Manager Unlock 실패                             | 모든 Log Analysis API                                        |
| 0x52003    | Log Manager 제거 실패                               | ALA_DisableLogging                                           |
| 0x52002    | Log File 닫기 실패                                  | ALA_DisableLogging                                           |
| 0x52009    | Active Transaction이 아님                           | ALA_GetXLog                                                  |
| 0x5200E    | Linked-List가 비어있지 않음                         | ALA_Handshake<br />ALA_DestroyXLogCollector                  |
| 0x52033    | XLog Pool이 비어 있음                               | ALA_ReceiveXLog                                              |
| 0x5200F    | NULL 파라미터                                       | 모든 Log Analysis API                                        |
| 0x5201D    | 유효하지 않은 파라미터                              | 모든 Log Analysis API                                        |
| 0x52014    | Network Timeout (재시도 가능)                       | ALA_ReceiveXLog                                              |
| 0x52026    | 지원하지 않는 Socket Type                           | ALA_Handshake                                                |
| 0x52025    | Socket Type이 선택되지 않음                         | ALA_Handshake                                                |
| 0x5202F    | Socket Type이 해당 Log Analysis API를 지원하지 않음 | ALA_AddAuthInfo<br />ALA_RemoveAuthInfo                      |
| 0x5202D    | XLog Sender 이름이 다름                             | ALA_Handshake                                                |
| 0x52030    | 인증 정보가 하나만 존재                             | ALA_RemoveAuthInfo                                           |
| 0x52031    | 더 이상 인증 정보를 추가할 수 없음                  | ALA_AddAuthInfo                                              |
| 0x52032    | Peer에 대한 인증 정보가 없음                        | ALA_Handshake                                                |
| 0x52010    | 유효하지 않은 ROLE                                  | ALA_Handshake                                                |
| 0x52011    | 유효하지 않은 Replication Flags                     | ALA_Handshake                                                |
| 0x52007    | Geometry Endian 변환 실패                           | ALA_GetXLog                                                  |
| 0x52036    | MTD Module을 얻을 수 없음                           | ALA_GetXLog<br />ALA_GetAltibaseText<br />ALA_GetAltibaseSQL |
| 0x52037    | MTD Module로 Text 생성 실패                         | ALA_GetAltibaseText                                          |
| 0x52038    | CMT 초기화 실패                                     | ALA_GetODBCCValue                                            |
| 0x52039    | CMT 종료 실패                                       | ALA_GetODBCCValue                                            |
| 0x5203A    | 분석 헤더 생성 실패 (ODBC 변환)                     | ALA_GetODBCCValue                                            |
| 0x5203B    | 분석 헤더 제거 실패 (ODBC 변환)                     | ALA_GetODBCCValue                                            |
| 0x5203C    | MT에서 CMT로 변환 실패                              | ALA_GetODBCCValue                                            |
| 0x5203D    | CMT에서 ulnColumn으로 변환 실패                     | ALA_GetODBCCValue                                            |
| 0x5203E    | ulnColumn에서 ODBC C로 변환 실패                    | ALA_GetODBCCValue                                            |

