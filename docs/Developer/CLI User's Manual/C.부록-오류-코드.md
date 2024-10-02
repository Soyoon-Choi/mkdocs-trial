# C.부록: 오류 코드

SQLError는 X/Open 및 SQL Access Group SQL CAE 규격(1992)과 ODBC 스펙에서 정의한
대로 SQLSTATE 값을 반환한다. SQLSTATE 값은 다섯 문자를 포함하는 문자열이다. 이
부록에서는 Altibase CLI와 ODBC를 위한 SQLSTATE 값을 설명한다.

### SQLSTATE

다음 테이블은 Altibase CLI 드라이버의 SQLError가 반환할 수 있는 SQLSTATE 값을
표시한다.

| SQLSTATE | Error                                                            | Can be returned from                                                                   |
|----------|------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| 01004    | 자료가 잘림 (반환 될 값의 크기가 주어진 버퍼의 크기보다 클 경우) | SQLDescribeCol SQLFetch SQLGetData                                                     |
| 07006    | 제한된 데이터 타입 속성 위반                                     | SQLBindParameter SQLExecute SQLFetch                                                   |
| 07009    | 유효하지 않은 설명자 인덱스                                      | SQLBindCol SQLBindParameter SQLColAttribute SQLDescribeCol SQLDescribeParam SQLGetData |

> \* SQLSTATE 08001, 08002, 08003, 08S01은 아래 참고
>

| SQLSTATE | Error                                                                                    | Can be returned from                                                                                                                                                                                                                                                                                                                                                                                         |
|----------|------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| HY000    | 일반 오류                                                                                | SQLAllocStmt SQLAllocConnect SQLBindCol SQLBindParameter SQLColAttribute SQLColumns SQLConnect SQLDescribeCol SQLDisconnect SQLDriverConnect SQLEndTran SQLExecDirect SQLExecute SQLFetch SQLFreeHandle SQLFreeStmt SQLGetData SQLNumParams SQLNumResultCols SQLPrepare SQLPrimaryKeys SQLProcedureColumns SQLProcedures SQLRowCount SQLSetAttribute SQLSetConnectAttr SQLSetEnvAttr SQLStatistics SQLTables |
| HY001    | 메모리 할당 오류 (ODBC가 함수를 실행하고 완료하기 위해 요구된 메모리를 할당할 수 없음)   | SQLAllocConnect SQLAllocStmt SQLBindCol SQLBindParameter SQLConnect SQLDriverConnect SQLExecDirect SQLGetTypeInfo SQLPrepare                                                                                                                                                                                                                                                                                 |
| HY003    | 애플리케이션 버퍼 타입이 유효하지 않음 (*cType* 인자의 값이 유효한 C 데이터 타입이 아님) | SQLBindCol SQLBindParameter                                                                                                                                                                                                                                                                                                                                                                                  |
| HY009    | 유효하지 않은 인자 사용 (null pointer)                                                   | SQLAllocConnect SQLAllocStmt SQLBindParameter SQLExecDirect SQLForeignKeys SQLPrimaryKeys SQLProcedureColumns SQLProcedures SQLSpecialColumns SQLStatistics SQLTablePrivileges                                                                                                                                                                                                                               |
| HY010    | 함수 연속 오류                                                                           | SQLAllocStmt SQLDescribeParam SQLGetData                                                                                                                                                                                                                                                                                                                                                                     |
| HY090    | 유효하지 않은 문자열 또는 버퍼 길이                                                      | SQLBindParameter SQLDescribeCol SQLExecute SQLForeignKeys SQLGetData SQLGetStmtAttr SQLTablePrivileges                                                                                                                                                                                                                                                                                                       |
| HY092    | 유효하지 않은 속성 또는 옵션                                                             | SQLGetStmtAttr                                                                                                                                                                                                                                                                                                                                                                                               |
| HY105    | 유효하지 않은 매개변수 타입                                                              | SQLBindParameter                                                                                                                                                                                                                                                                                                                                                                                             |
| HYC00    | 지원하지 않는 속성 사용                                                                  | SQLGetConnectAttr SQLGetStmtAttr                                                                                                                                                                                                                                                                                                                                                                             |

#### 데이터베이스 연결 관련 오류

| SQLSTATE | Code    | Error                                                                                     | Can be returned from        |
|----------|---------|-------------------------------------------------------------------------------------------|-----------------------------|
| HY000    | 0x51001 | Character set가 존재하지 않음                                                             | SQLConnect SQLDriverConnect |
|          | 0x5003b | The communication buffer is insufficient. (통신 버퍼의 길이를 초과했음)                   | SQLExecute                  |
| HY001    | 0x5104A | 메모리 할당 오류(드라이버가 함수를 실행하고 완료하기 위해 요구된 메모리를 할당할 수 없음) | SQLConnect SQLDriverConnect |
| 08001    | 0x50032 | 드라이버가 DB에 연결을 설정할 수 없음                                                     | SQLConnect SQLDriverConnect |

#### 네트워크 관련 오류

| SQLSTATE | Code    | Error                                                                   | Can be returned from                                                                                                                                                                                                                                 |
|----------|---------|-------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 08002    | 0x51035 | 해당 *dbc*는 이미 DB에 연결 되 있음                                     | SQLConnect SQLDriverConnect                                                                                                                                                                                                                          |
| 08003    | 0x51036 | *stmt*가 연결 되지 않은 상태거나 연결이 끊어진 상태                     | SQLExecDirect SQLExecute SQLPrepare                                                                                                                                                                                                                  |
| 08S01    | 0x51043 | 통신 회선 장애 (ODBC와 DB간에 함수 처리가 완료되기 전에 통신 회선 실패) | SQLColumns SQLConnect SQLDriverConnect SQLExecDirect SQLExecute SQLFetch SQLForeignKeys SQLGetConnectAttr SQLPrepare SQLPrimaryKeys SQLProcedureColumns SQLProcedures SQLSetConnectAttr SQLSpecialColumns SQLStatistics SQLTablePrivileges SQLTables |

### 명령문 상태 전이

다음 테이블들은 명령문 상태에서 해당 핸들 타입(environment, connection, 또는
statement)을 사용하고 있는 Altibase CLI 함수들이 호출됐을 때 각 상태들의 전환이
어떻게 되는지를 보여준다.

Altibase CLI 명령문들은 다음과 같은 상태를 갖는다.

| State | Description                                                                 |
|-------|-----------------------------------------------------------------------------|
| S0    | Unallocated statement. (The connection state must be connected connection.) |
| S1    | Allocated statement.                                                        |
| S2    | Prepared statement. (A (possibly empty) result set will be created.)        |
| S6    | Cursor positioned with SQLFetch.                                            |

전환 테이블내에서의 각 entry 값은 다음 중 하나이다.

-   \-- : 함수를 실행한 후 상태의 변환이 없는 경우

-   Sn : 명령문 상태가 특정 상태로 전환된 경우

-   (IH) : Invalid Handle

-   (HY010) : Function sequence error

-   (24000) :

> Note)
>
> -   S : Success. 이 경우 함수는 다음 값들 중 하나를 반환한다:
>     SQL_SUCCESS_WITH_INFO 또는 SQL_SUCCESS.
>
> -   E : Error. 이 경우 함수는 SQL_ERROR를 반환한다:
>
> -   R : Results. 명령문을 수행했을 때 결과 집합이 있슴. (결과 집합은 empty set
>     일 가능성이 있다.)
>
> -   NR : No Results. 명령문을 수행했을 때 결과 집합이 없슴.
>
> -   NF : No Data Found. 함수는 SQL_NO_DATA를 반환한다.
>
> -   RD : Receive Done
>
> -   P : Prepared. The statement was prepared.
>
> -   NP : Not Prepared. The statement was not prepared.
>

예를 들어 다음은 SQLPrepare 함수에 대한 statement state transition table을 보는
방법이다.

<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td rowspan="2">(IH)</td>
       <td rowspan="2">S => S1</td>
       <td>S => S2 </td>
       <td rowspan="2">(24000)</td>
   </tr>  
   <tr> 
      <td>E => S1</td>
   </tr>
</table>
핸들 타입이 SQL_HANDLE_STMT 이며 명령문 상태가 S0 일 때 SQLPrepare 함수가 불려진
경우, -SQL_INVALID_HANDLE (IH)이 반환된다. 핸들 타입이 SQL_HANDLE_STMT 이고
상태가 S1일 때는 불려진 함수 SQLPrepare가 성공적으로 수행되면 S1 상태를 그대로
유지한다. 핸들 타입이 SQL_HANDLE_STMT 이고 S2인 상태에서 SQLPrepare 함수가
불렸을 때 그 함수가 성공적으로 수행되면 명령문의 상태는 S2로 전환되고 수행에
실패를 했을 경우 명령문의 상태는 S1 상태 그대로 남아있다. 핸들 타입이
SQL_HANDLE_STMT인 S6 상태에서 함수가 불리우면 항상 SQL_ERROR와 SQLSTATE 24000
(Invalid Cursor State)이 반환된다.

**SQLAllocHandle**
<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td>--</td>
      <td rowspan="2">--</td>
       <td rowspan="2">--</td>  
       <td rowspan="2">--</td>
   </tr>  
   <tr> 
      <td>S1*</td>
   </tr>
</table>


>  \* *HandleType*이 SQL_HANDLE_STMT인 경우
>

**SQLBindCol**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch |
|----------------|--------------|-------------|------------|
| (IH)           | \--          | \--         | \--        |

**SQLBindParameter**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch |
|----------------|--------------|-------------|------------|
| (IH)           | \--          | \--         | \--        |

**SQLColumns, SQLGetTypeInfo, SQLPrimaryKeys, SQLProcedureColumns,
SQLProcedures, SQLStatistics, SQLTables**

<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td rowspan="2">(IH)</td>
      <td rowspan="2"> S => S6</td>
       <td >E => S1</td>  
       <td rowspan="2">(24000) </td>
   </tr>  
   <tr> 
      <td>S => S6 </td>
   </tr>
</table>


**SQLConnect**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch |
|----------------|--------------|-------------|------------|
| (Error)        | (Error)      | (Error)     | (Error)    |

**SQLDisconnect**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch |
|----------------|--------------|-------------|------------|
| \--            | \* =\> S0    | \* =\> S0   | \* =\> S0  |

> \* 함수 SQLDisconnect를 부르면 연결 핸들과 연관된 모든 명령문들을 종료한다.
> 그리고, 이 함수는 연결 상태를 allocated connection 상태로 놓는다; 명령문 상태가
> S0가 되기 전에 연결 상태는 C4 (connected connection)이다.

**SQLDriverConnect**

SQLConnect 참고

**SQLExecDirect**
<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td rowspan="3">(IH)</td>
      <td> S, NR => --</td>
      <td >S, NR => S1</td>  
      <td rowspan="3">(24000) </td>
   </tr>  
   <tr> 
   	  <td  rowspan="2">S, R => S6 </td>
      <td> S, R => S6  </td>
   </tr>
   <tr> 
      <td> E => S1 </td>
   </tr>
</table>


**SQLExecute**

<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td rowspan="3">(IH)</td>
      <td rowspan="3"> (HY010) </td>
      <td >S, NR => --</td>  
      <td rowspan="3">(24000) </td>
   </tr>  
   <tr> 
      <td> S, R => S6 </td>
   </tr>
   <tr> 
      <td> E => --  </td>
   </tr>
</table>

**SQLFetch**

<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td>(IH)</td>
      <td> (HY010) </td>      
      <td>(HY010) </td>
      <td>S => --</td>  
   </tr>
</table>


**SQLFreeHandle**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch |
|----------------|--------------|-------------|------------|
| \--            | (HY010)      | (HY010)     | (HY010)    |
| (IH)           | S0           | S0          | S0         |

(1) 첫 번째 행은 *handleType*이 SQL_HANDLE_ENV 또는 SQL_HANDLE_DBC인 경우

(2) 두 번째 행은 *handleType*이 SQL_HANDLE_STMT인 경우

**SQLFreeStmt**
<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td rowspan="2">(IH)</td>
      <td rowspan="2"> -- </td>      
      <td rowspan="2">--</td>
      <td >NP = > S1</td>  
   </tr>  
   <tr>
       <td> P => S2</td>
   </tr>
   <tr> 
      <td> (IH)</td>
      <td>S0</td>
      <td>S0</td>
      <td>S0</td>
   </tr>
</table>
(1) 첫 번째 행은  *fOption*이 SQL_CLOSE인 경우

(2) 두 번째 행은 *fOption*이 SQL_DROP인 경우

**SQLGetData**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch       |
|----------------|--------------|-------------|------------------|
| (IH)           | (HY010)      | (HY010)     | S \|\| NF =\> -- |


**SQLGetTypeInfo**

SQLColumns 참고

**SQLNumResultCols**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch |
|----------------|--------------|-------------|------------|
| (IH)           | (HY010)      | S =\> --    | S =\> --   |

**SQLPrepare**
<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td rowspan="2">(IH)</td>
      <td rowspan="2">S => -- </td>      
      <td> S => --</td>
      <td rowspan="2">(24000) </td>  
   </tr>  
   <tr>
       <td> E => S1 </td>
   </tr>
</table>

**SQLPrimaryKeys**

SQLColumns 참고

**SQLProcedureColumns**

SQLColumns 참고

**SQLProcedures**

SQLColumns 참고

**SQLSetConnectAttr**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch |
|----------------|--------------|-------------|------------|
| \--\*          | \--          | \--         | (24000)    |

> \* 설정한 속성 (*Attribute*)이 연결 속성인 경우. 설정한 속성이 명령문 속성인
> 경우는 SQLSetStmtAttr 참고.

**SQLSetEnvAttr**

| S0 Unallocated | S1 Allocated | S2 Prepared | S6 Infetch |
|----------------|--------------|-------------|------------|
| (Error)        | (Error)      | (Error)     | (Error)    |

**SQLSetStmtAttr**
<table>
   <tr>
      <th>S0 Unallocated</th>
      <th>S1Allocated</th>
      <th>S2 Prepared</th>
      <th>S6 Infetch</th>
   </tr>
   <tr>
      <td rowspan="2">(IH)</td>
      <td rowspan="2">-- </td>      
      <td> (1) => -- </td>
      <td>(1) => --  </td>  
   </tr>  
   <tr>
       <td> (2) => (Error) </td>
       <td>(2) => (24000)  </td>
   </tr>
</table>

(1) *Attribute* 인자가 SQL_ATTR_CONCURRENCY, SQL_ATTR_CURSOR_TYPE,
SQL_ATTR_SIMULATE_CURSOR, SQL_ATTR_USE_BOOKMARKS, SQL_ATTR_CURSOR_SCROLLABLE,
또는 SQL_ATTR_CURSOR_SENSITIVITY이 아닌 경우

(2) *Attribute* 인자가 SQL_ATTR_CONCURRENCY, SQL_ATTR_CURSOR_TYPE,
SQL_ATTR_SIMULATE_CURSOR, SQL_ATTR_USE_BOOKMARKS, SQL_ATTR_CURSOR_SCROLLABLE,
또는 SQL_ATTR_CURSOR_SENSITIVITY인 경우

**SQLStatistics**

SQLColumns 참고

**SQLTables**

SQLColumns 참고

### 상태 전이 테이블

다음은 state transition에 영향을 미치는 주요 함수들을 요약한 것이다.
<table>
  <tr>
    <th><img src="media/CLI/diagonal.png"/></th>
    <th>S0
UNALLOCATED
</th>
    <th>S1
ALLOCATED
</th>
    <th>S2
PREPARED
</th>
    <th>S6
INFETCH
</th>
  </tr>
  <tr>
        <td rowspan="2">Prepare</td>
        <td rowspan="2">(IH)</td>
        <td rowspan="2">S => S1</td>
        <td>S => S2</td>
        <td rowspan="2">(24000)</td>
  </tr>
  <tr>
   		<td>E => S1</td>
   </tr>
   <tr>
        <td rowspan="3">ExecDirect</td>
        <td rowspan="3">(IH)</td>
        <td>S,NR => S1</td>
        <td>S => S2</td>
        <td rowspan="3">(24000)</td>
    </tr>
    <tr>
        <td rowspan="2">S,R => S6</td>
        <td>S,R => S6</td>
    </tr>
    <tr>
    	<td>E => S1</td>
    </tr>
    <tr>
        <td rowspan="3">Execute</td>
        <td rowspan="3">(IH)</td>
        <td rowspan="3">(HY010)</td>
        <td>S,NR => S2</td>
        <td rowspan="3">(24000)</td>
    </tr>
    <tr>
        <td>S,R => S6</td>
    </tr>
    <tr>
    	<td>E => S2</td>
    </tr>
     <tr>
        <td>Fetch</td>
        <td>(IH)</td>
        <td>(HY010)</td>
        <td>(HY010)</td>
        <td>S => S6</td>        
    </tr>
    <tr>
        <td rowspan="2">FreeStmt
(CLOSE)
</td>
        <td rowspan="2">(IH)</td>
        <td rowspan="2">S1</td>
        <td rowspan="2">S2</td>
        <td>NP => S1</td>        
    </tr>
    <tr>
        <td>P => S2</td>
    </tr>
    <tr>
    	<td>FreeStmt
(DROP)
</td>
    	<td>(IH)</td>
        <td>S0</td>
        <td>S0</td>
        <td>S0</td>
    </tr>
</table>

Cf )

\- (IH) : Invalid Handle (HY010) : Function Sequence Error

\- (24000) : Invalid Cursor State

\- S : Success E : Error except Network Error

\- R : Results NR : No Results NF : No data Found RD: Receive Done

\- P : Prepared NP : Not Prepared

