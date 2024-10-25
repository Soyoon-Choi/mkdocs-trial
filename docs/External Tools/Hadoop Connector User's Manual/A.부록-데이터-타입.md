# A.부록: 데이터 타입

이 부록은 Altibase 하둡 커넥터가 지원하는 Altibase의 데이터 타입에 대해
기술한다.

### 지원되는 데이터 타입

아래는 Altibase 하둡 커넥터를 사용하여 import 또는 export 할 때의 Altibase와
Sqoop(Altibase 하둡 커넥터) 간에 각 데이터 타입의 변환을 보여주는 표이다. 또한
각 데이터 타입별 import 및 export 지원 여부도 보여준다.

| Altibase 데이터 타입 | Sqoop 데이터 타입              | Import 지원 여부 | Export 지원 여부 |
|----------------------|--------------------------------|------------------|------------------|
| CHAR                 | String                         | O                | O                |
| VARCHAR              | String                         | O                | O                |
| NCHAR                | String                         | O                | O                |
| NVARCHAR             | String                         | O                | O                |
| INTEGER              | Integer                        | O                | O                |
| BIGINT               | Long                           | O                | O                |
| SMALLINT             | Integer                        | O                | O                |
| NUMBER               | Double                         | O                | O                |
| NUMERIC              | java.math.BigDecimal           | O                | O                |
| DECIMAL              | java.math.BigDecimal           | O                | O                |
| FLOAT                | Double                         | O                | O                |
| DOUBLE               | Double                         | O                | O                |
| REAL                 | Float                          | O                | O                |
| DATE                 | java.sql.Timestamp             | O                | O                |
| BLOB                 | com.cloudera.sqoop.lib.BlobRef | O                | X                |
| CLOB                 | com.cloudera.sqoop.lib.ClobRef | O                | X                |

> 참고: BLOB와 CLOB 데이터 타입은 Sqoop에서 현재 import 기능만 지원하므로,
> Altibase 하둡 커넥터도 import만 지원한다. BLOB와 CLOB 데이터 타입의 export
> 기능은 추후 지원할 예정이다.
