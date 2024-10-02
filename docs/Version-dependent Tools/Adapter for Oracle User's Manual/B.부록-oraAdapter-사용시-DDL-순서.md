# B.부록: oraAdapter 사용시 DDL 순서

### oraAdapter 사용시 DDL 수행 순서

oraAdapter를 사용할 때 이중화를 수행중인 DDL은 아래의 순서대로 수행해야 한다.

<table>
<thead>
<tr>
<th>No</th>
<th>Active Server</th>
<th>oraAdapter</th>
<th>Standby Server</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<p>1.양쪽 서버에 스키마 생성</p>
</td>
<td>
<p>CREATE TABLE T1 ( C1 INTEGER PRIMARY KEY, C2 SMALLINT );</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>CREATE TABLE T1 ( C1 INTEGER PRIMARY KEY, C2 SMALLINT );</p>
</td>
</tr>
<tr>
<td>
<p>2.ANALYSIS로 이중화 생성</p>
</td>
<td>
<p>CREATE REPLICATION ala FOR ANALYSIS<br /> WITH 'Standby IP', Standby Port<br /> FROM SYS.T1 TO SYS T1;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>3.oraAdapter 시작</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>$ oaUtility start</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>4.이중화 시작</p>
</td>
<td>
<p>ALTER REPLICATION ala START;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>5.이중화 Gap 제거를 위해 Flush 구문 수행</p>
</td>
<td>
<p>ALTER REPLICATION ALA FLUSH ALL;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>6.DDL 수행을 위한 이중화 관련 프로퍼티 값 설정</p>
</td>
<td>
<p>ALTER SYSTEM SET REPLICATION_DDL_ENABLE = 1;</p>
<p>&nbsp;</p>
<p>ALTER SYSTEM SET REPLICATION_DDL_ENABLE_LEVEL = 1;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>7.Active 서버에 DDL 수행&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>Adapter 종료 (DDL 로그 처리로 인하여)</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>8.oraAdapter trc 로그 확인</p>
</td>
<td>
<p>SELECT REP_NAME, STATUS FROM V$REPSENDER;<br /> 로 조회 하여 STATUS 가 2 확인</p>
</td>
<td>
<p>'Log Record : Meta change xlog was arrived, adapter will be finished'<br /> trc 로그 메시지 확인</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>9.Standby 서버에 DDL 수행</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>DDL</p>
</td>
</tr>
<tr>
<td>
<p>10.oraAdapter 재실행</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>$ oaUtility start</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>11.이중화 중지 및 재시작 (생략가능)</p>
</td>
<td>
<p>(optional)</p>
<p>ALTER REPLICATION ALA STOP;</p>
<p>ALTER REPLICATION ALA START;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td>
<p>12.데이터 복제 여부 확인</p>
</td>
<td>
<p>DML ( Service )</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>데이터 복제 확인</p>
</td>
</tr>
<tr>
<td>
<p>13.DDL 중지를 위한 이중화 관련 프로퍼티 값 설정</p>
</td>
<td>
<p>ALTER SYSTEM SET REPLICATION_DDL_ENABLE = 0;</p>
<p>ALTER SYSTEM SET REPLICATION_DDL_ENABLE_LEVEL = 0;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
<td>
<p>&nbsp;</p>
</td>
</tr>
</tbody>
</table>
