# E.부록: PSM 변환기 규칙 목록

Migration Center는 Oracle 또는 TimesTen 11.2에서 Altibase로 마이그레이션을 할 때, PSM 변환기가 PSM 타입의 데이터베이스 객체를 생성할 수 있는 DDL SQL 문장을 제공한다.

PSM 변환기에는 DDL SQL 문장을 변환하는 규칙이 있으며, 그 규칙은 아래의 세 가지 종류로 분류된다.

- `CONVERTED` : 변환 가능

- `REMOVED` : 변환 불가, 그러나 제거 가능

- `TODO` : 변환 불가 및 제거 불가

TODO 규칙이 PSM 객체에 적용된다면, 해당 객체는 To-Do 리스트 창에 표시될 것이다. 그렇지 않다면, Done 리스트 창에 표시될 것이다.

각각의 규칙에 "버전 범위" 항목이 기술된 경우, 해당 규칙은 기술된 Altibase버전에만 적용됨을 의미한다. "버전 범위" 항목이 생략된 규칙은 모든 Altibase버전에 적용됨을 의미한다.

복수의 구문을 변환할 때에는 각각의 SQL 구문 마지막에 `'/'`를 표기하여 구분해야 한다.

### 뷰 변환 규칙

#### RULE-11001

###### 타입

`REMOVED`

###### 설명

'WITH CHECK OPTION'이 제거되었다.

###### 원본 SQL 문장

```sql
CREATE OR REPLACE VIEW v1 
AS SELECT * FROM t1
WITH CHECK OPTION;
```

###### 변환된 SQL 문장

```sql
CREATE OR REPLACE VIEW v1 
AS SELECT * FROM t1
/* WITH CHECK OPTION */ /* [REMOVED] RULE-11001 : 'WITH CHECK OPTION' is removed */;
```

#### RULE-11002

###### 타입

`REMOVED`

###### 설명

별칭의 제약조건이 제거되었다.

###### 원본 SQL 문장

```sql
CREATE OR REPLACE VIEW v1 
(a1 UNIQUE) 
AS SELECT c1 FROM t1;
```

###### 변환된 SQL 문장

```sql
CREATE OR REPLACE VIEW v1
(a1 /* UNIQUE */ /* [REMOVED] RULE-11002 : Inline constraints are removed*/)
AS SELECT c1 FROM t1;
```

#### RULE-11003

###### 타입

`TODO`

###### 설명 

뷰 레벨 제약조건은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 
(c1, CONSTRAINT v1_uk UNIQUE(c1)) 
AS SELECT c1 FROM t1; 
~~~

###### 변환된 SQL 문장

```sql
CREATE OR REPLACE VIEW v1 
(c1, CONSTRAINT v1_uk UNIQUE(c1) /* [TODO] RULE-11003 : Out of line constraint must be converted manually */)
AS SELECT c1 FROM t1;
```

#### RULE-11004

###### 타입

`REMOVED`

###### 설명

BEQUEATH 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 
BEQUEATH CURRENT_USER 
AS SELECT * FROM t1;
~~~

###### 변환된 SQL 문장

 ~~~sql
CREATE OR REPLACE VIEW v1 
/* BEQUEATH CURRENT_USER */ /* [REMOVED] RULE-11004 : BEQUEATH clause is removed */
AS SELECT * FROM t1;
 ~~~

#### RULE-11005

###### 타입 

`TODO`

###### 설명

XML타입 뷰 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 
OF XMLTYPE WITH OBJECT ID DEFAULT 
AS SELECT * FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 
OF XMLTYPE WITH OBJECT ID DEFAULT /* [TODO] RULE-11005 : XMLType view should be manually converted */ 
AS SELECT * FROM t1;
~~~



#### RULE-11006

###### 타입

`TODO`

###### 설명

객체 타입 뷰 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1_1
OF type1 UNDER v1
AS SELECT * FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1_1
OF type1 UNDER v1 /* [TODO] RULE-11006 : An object view must be converted manually */
AS SELECT * FROM t1;
~~~



#### RULE-11007

###### 타입

`REMOVED`

###### 설명

VISIBLE 또는 INVISIBLE이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
(c1, c2 INVISIBLE)
AS SELECT * FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
(c1, c2 /* INVISIBLE */ /* [REMOVED] RULE-11007 : VISIBLE or INVISIBLE is removed */)
AS SELECT * FROM t1;
~~~

#### RULE-11008

###### 타입

`REMOVED`

###### 설명

FORCE가 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FORCE VIEW v1
(c1, c2)
AS SELECT * FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE /* FORCE */ /* [REMOVED] RULE-11008 : FORCE has been removed */ VIEW v1
(c1, c2)
AS SELECT * FROM t1;
~~~


### 트리거 변환 규칙

#### RULE-12002

> *이 규칙은 Altibase 6.3.1 이전 버전에 적용된다.* 

###### 타입

`TODO`

###### 설명

‘INSTEAD OF’는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER log_attendance
INSTEAD OF INSERT ON attendance_view FOR EACH ROW
BEGIN
IF :NEW.cnt < 2 THEN
INSERT INTO daily_log VALUES(:NEW.id, CURRENT_TIMESTAMP);
END IF;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER log_attendance
INSTEAD OF /* [TODO] RULE-12002 : 'INSTEAD OF' must be converted manually */ INSERT ON attendance_view FOR EACH ROW
BEGIN
IF :NEW.cnt < 2 THEN
INSERT INTO daily_log VALUES(:NEW.id, CURRENT_TIMESTAMP);
END IF;
END;
~~~


#### RULE-12003

###### 타입

`TODO`

###### 설명

여러 개의 이벤트를 지원하는 트리거는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE INSERT OR DELETE ON t1
BEGIN
NULL;
END;
~~~


###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE INSERT OR DELETE ON t1 /* [TODO] RULE-12003 : Triggers supporting multiple events must be converted manually */
BEGIN
NULL;
END;
~~~


#### RULE-12004

이 규칙은 저장 프로시저 블록에 사용된DECLARE 절에 관한 것으로 Altibase 서버 버전에 따라 다르게 적용된다. 

###### 타입

`TODO`

###### 설명

***Altibase 6.1.1 이하 버전에 적용되는 규칙***

- 저장 프로시저 블록 앞에 DECLARE가 있으면 AS 또는 IS로 변경하고 생략된 경우 AS 또는 IS를 추가해야 한다.

  > Altibase 6.1.1 이하 버전에서 DECLARE는 지원하지 않으며 AS 또는 IS 이 필수 구문이다. 

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE INSERT ON t1
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE INSERT ON t1
BEGIN /* [TODO] RULE-12004 : 'AS' or 'IS' should be used regardless of that DECLARE exists or not in the PSM block. */
NULL;
END;
~~~

***Altibase 6.3.1 / Altibase 6.5.1.0.0 ~ 6.5.1.3.7***

- 저장 프로시저 블록의 선언부 앞에 DECLARE가 있으면 AS 또는 IS로 변경하고 생략된 경우 그대로 적용한다.

  > 해당 버전에서 DECLARE는 지원하지 않으며 AS 또는 IS 는 선택적으로 사용하는 구문이다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE INSERT ON t1
DECLARE
v1 NUMBER := 1;
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE INSERT ON t1
DECLARE /* [TODO] RULE-12004 : 'AS' or 'IS' must replace 'DECLARE' that starts the declarative part of the block */
v1 NUMBER := 1;
BEGIN
NULL;
END;
~~~

#### RULE-12005

###### 타입

`TODO`

###### 설명

비 DML 트리거는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE CREATE ON DATABASE
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE CREATE ON DATABASE /* [TODO] RULE-12005 : Non DML trigger must be converted manually */
BEGIN
NULL;
END;
~~~


#### RULE-12007

###### 타입

`TODO`

###### 설명

중첩 테이블은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
INSTEAD OF DELETE ON NESTED TABLE t1 OF v1
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
INSTEAD OF DELETE ON NESTED TABLE t1 OF v1 /* [TODO] RULE-12007 : Nested table must be converted manually */
BEGIN
NULL;
END;
~~~

#### RULE-12008

###### 타입

`TODO`

###### 설명

CALL 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER DELETE ON t1
CALL testproc1(a1, a2);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER DELETE ON t1
CALL testproc1(a1, a2) /* [TODO] RULE-12008 : CALL routine clause must be converted manually */;
~~~

#### RULE-12009

###### 타입

`TODO`

###### 설명

중첩 테이블의 부모 row는 표시할 수 없다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
INSTEAD OF DELETE ON NESTED TABLE t1 OF v1
REFERENCING PARENT AS parent FOR EACH ROW
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
INSTEAD OF DELETE ON NESTED TABLE t1 OF v1
REFERENCING PARENT AS parent /* [TODO] RULE-12009 : Parent value of the current row cannot be specified */ FOR EACH ROW
BEGIN
NULL;
END;
~~~

#### RULE-12010

###### 타입

`TODO`

###### 설명

트리거의 순서를 배치하는 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER 
AFTER DELETE ON t1
FOLLOWS trig2
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER 
AFTER DELETE ON t1
FOLLOWS trig2 /* [TODO] RULE-12010 : Trigger ordering clause must be converted manually */
BEGIN
NULL;
END;
~~~

#### RULE-12011

###### 타입

`CONVERTED`

###### 설명

REFERENCING절에 생략된 row가 추가되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER INSERT ON t1 FOR EACH ROW
BEGIN
:new.c1 := SYSDATE;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER INSERT ON t1
REFERENCING NEW AS new FOR EACH ROW
BEGIN
:new.c1 := SYSDATE;
END;
~~~

#### RULE-12012

###### 타입

`CONVERTED`

###### 설명

Altibase 예약어에 해당하는 지역(Local) 식별자는 변환시 접미사가 추가되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER UPDATE ON t1
REFERENCING NEW AS new OLD AS old FOR EACH ROW
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER UPDATE ON t1
REFERENCING NEW AS new_POC OLD AS old_POC FOR EACH ROW
BEGIN
NULL;
END;
~~~

#### RULE-12013

###### 타입

`REMOVED`

###### 설명

트리거 에디션 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER DELETE ON t1
CROSSEDITION
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER DELETE ON t1
/* CROSSEDITION */ /* [REMOVED] RULE-12013 : Trigger edition clause is removed */
BEGIN
NULL;
END;
~~~

#### RULE-12014

###### 타입

`REMOVED`

###### 설명

ENABLE이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER INSERT ON t1
ENABLE
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER INSERT ON t1
/* ENABLE */ /* [REMOVED] RULE-12014 : ENABLE is removed */
BEGIN
NULL;
END;
~~~

#### RULE-12015

###### 타입

`TODO`

###### 설명

DISABLE은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER DELETE ON t1
DISABLE
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER DELETE ON t1
DISABLE /* [TODO] RULE-12015 : DISABLE must be converted manually */
BEGIN
NULL;
END;
~~~

#### RULE-12016

###### 타입

`CONVERTED`

###### 설명

REFERENCING절에서 정의된 row를 참조하는 별칭 앞 콜론(:)이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE INSERT ON t1 FOR EACH ROW
BEGIN
DBMS_OUTPUT.PUT_LINE(:new.c1);
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE INSERT ON t1 FOR EACH ROW
BEGIN
DBMS_OUTPUT.PUT_LINE(new.c1);
END;
~~~

#### RULE-12017

###### 타입

`REMOVED`

###### 설명

CREATE TRIGGER문에서 PL/SQL block 끝의 trigger label 이름이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER INSERT ON t1
BEGIN
NULL;
END trig1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
AFTER INSERT ON t1
BEGIN
NULL;
END /* trig1 */ /* [REMOVED] RULE-12017 : The trigger label name at the end of body has been removed */;
~~~

### 함수 변환 규칙

#### RULE-13001

> *이 규칙은 Altibase 6.3.1 이전 버전에서 적용된다.* 

###### 타입

`TODO`

###### 설명

AS LANGUAGE 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1
RETURN VARCHAR2
AS LANGUAGE JAVA
NAME 'test.quote() return java.lang.String';
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1
RETURN VARCHAR2
AS LANGUAGE JAVA
NAME 'test.quote() return java.lang.String'/* [TODO] RULE-13001 : AS LANGUAGE clause must be converted manually */;
~~~

#### RULE-13002

###### 타입

`REMOVED`

###### 설명

AUTHID 절(호출자 권한 절)이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
AUTHID CURRENT_USER
IS
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
/* AUTHID CURRENT_USER */ /* [REMOVED] RULE-13002 : The invoker rights clause is removed */
IS
BEGIN
RETURN a1;
END;
~~~

#### RULE-13003

###### 타입

`REMOVED`

###### 설명

PARALLEL_ENABLE 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
PARALLEL_ENABLE
IS
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
/* PARALLEL_ENABLE */ /* [REMOVED] RULE-13003 : PARALLEL_ENABLE clause is removed */
IS
BEGIN
RETURN a1;
END;
~~~

#### RULE-13004

###### 타입

`REMOVED`

###### 설명

RESULT_CACHE 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
RESULT_CACHE RELIES_ON(t1, t2)
IS
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
/* RESULT_CACHE RELIES_ON(t1, t2) */ /* [REMOVED] RULE-13004 : RESULT_CACHE clause is removed */
IS
BEGIN
RETURN a1;
END;
~~~

#### RULE-13005

###### 타입

`REMOVED`

###### 설명

DETERMINISTIC이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
DETERMINISTIC
IS
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
/* DETERMINISTIC */ /* [REMOVED] RULE-13005 : 'DETERMINISTIC' is removed */
IS
BEGIN
RETURN a1;
END;
~~~

#### RULE-13006

###### 타입

`TODO`

###### 설명

PIPELINED는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION getCityList RETURN tripLog_pkg.nt_city PIPELINED AS
BEGIN
FOR i IN 1..tripLog_pkg.v_cityList.LAST LOOP
PIPE ROW(tripLog_pkg.v_cityList(i));
END LOOP;
RETURN;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION getCityList RETURN tripLog_pkg.nt_city PIPELINED /* [TODO] RULE-13006 : The keyword PIPELINED must be converted manually */ AS
BEGIN
FOR i IN 1 .. tripLog_pkg.v_cityList.LAST LOOP
PIPE ROW(tripLog_pkg.v_cityList(i)) /* [TODO] RULE-32012 : The PIPE ROW statement must be converted manually */;
END LOOP;
RETURN;
END;
~~~

#### RULE-13007

###### 타입

`TODO`

###### 설명

PIPELINED USING 또는 AGGRAGATE USING 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1
RETURN NUMBER
AGGREGATE USING implementation_type;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1
RETURN NUMBER
AGGREGATE USING implementation_type/* [TODO] RULE-13007 : PIPELINED USING or AGGRAGATE USING clause must be converted manually */;
~~~

#### RULE-13008

> *이 규칙은 Altibase 6.3.1 이상에서 적용된다.* 

###### 타입

`TODO`

###### 설명

WITH CONTEXT 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1
RETURN NUMBER IS
LANGUAGE C LIBRARY lib1 WITH CONTEXT PARAMETERS(CONTEXT);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1
RETURN NUMBER IS
LANGUAGE C LIBRARY lib1 WITH CONTEXT /* [TODO] RULE-13008 : WITH CONTEXT clause must be converted manually */PARAMETERS(CONTEXT);
~~~

#### RULE-13009

> *이 규칙은 Altibase 6.3.1 이상에서 적용된다.* 

###### 타입

`TODO`

###### 설명

AGENT IN 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1
RETURN NUMBER IS
LANGUAGE C LIBRARY lib1 AGENT IN(EXTPROC);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1
RETURN NUMBER IS
LANGUAGE C LIBRARY lib1 AGENT IN(EXTPROC)/* [TODO] RULE-13009 : AGENT IN clause must be converted manually */;
~~~

#### RULE-13010

###### 타입

`REMOVED`

###### 설명

ACCESSIBLE BY 절은 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
ACCESSIBLE BY (TRIGGER trig1)
IS
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
/* ACCESSIBLE BY (TRIGGER trig1) */ /* [REMOVED] RULE-13010 : The ACCESSIBLE BY clause is removed */
IS
BEGIN
RETURN a1;
END;
~~~

#### RULE-13011

> *이 규칙은 Altibase 6.3.1 이상에서 적용된다.*

###### 타입

`TODO`

###### 설명

JAVA 함수 호출은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN VARCHAR2 IS
LANGUAGE JAVA NAME
'com.altibase.ex.empMgr.addEmp(java.lang.String)';
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN VARCHAR2 IS
LANGUAGE JAVA NAME
'com.altibase.ex.empMgr.addEmp(java.lang.String)' /* [TODO] RULE-13011 : Java call specification must be converted manually */;
~~~

#### RULE-13012

> *이 규칙은 Altibase 6.3.1 이상에서 적용된다.*

###### 타입

`TODO`

###### 설명

CONTEXT와 SELF 매개변수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN NUMBER AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1, a1 LENGTH, SELF);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN NUMBER AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1, a1 LENGTH, SELF)/* [TODO] RULE-13012 : The external parameter CONTEXT and SELF should be manually converted */);
~~~

#### RULE-13013

> *이 규칙은 Altibase 6.3.1 이상에서 적용된다.*

###### 타입

`TODO`

###### 설명

INDICATOR, LENGTH, MAXLEN을 제외한 속성은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN NUMBER AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1, a1 CHARSETID, a1 CHARSETFORM);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN NUMBER AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1, a1 CHARSETID /* [TODO] RULE-13013 : The property except for INDICATOR, LENGTH, MAXLEN must be converted manually */, a1 CHARSETFORM /* [TODO] RULE-13013 : The properties should be manually converted except INDICATOR, LENGTH, and MAXLEN */);
~~~

#### RULE-13014

> *이 규칙은 Altibase 6.3.1 이상에서 적용된다.*

###### 타입

`TODO`

###### 설명

BY REFERENCE 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1 BY REFERENCE);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1 BY REFERENCE /* [TODO] RULE-13014 : BY REFERENCE clause must be converted manually */);
~~~

#### RULE-13015

> *이 규칙은 Altibase 6.3.1 이상에서 적용된다.*

###### 타입

`TODO`

###### 설명

매개변수의 외부 데이터 타입은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1 OCINUMBER);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1 OCINUMBER /* [TODO] RULE-13015 : External data type of the parameters should be manually converted */);
~~~


### 프로시저 변환 규칙

#### RULE-14001

> *이 규칙은 Altibase 6.3.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

AS LANGUAGE 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
AS LANGUAGE JAVA
NAME 'test.quote() return java.lang.String';
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
AS LANGUAGE JAVA
NAME 'test.quote() return java.lang.String'/* [TODO] RULE-14001 : AS LANGUAGE clause must be converted manually */;
~~~

#### RULE-14002

###### 타입

`REMOVED`

###### 설명

AUTHID 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
AUTHID DEFINER
IS
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
/* AUTHID DEFINER */ /* [REMOVED] RULE-14002 : AUTHID clause is removed */
IS
BEGIN
NULL;
END;
~~~

#### RULE-14003

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

WITH CONTEXT 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
LANGUAGE C LIBRARY lib1 WITH CONTEXT;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
LANGUAGE C LIBRARY lib1 WITH CONTEXT /* [TODO] RULE-14003 : WITH CONTEXT clause must be converted manually */;
~~~

#### RULE-14004

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.* 

###### 타입

`TODO`

###### 설명

AGENT IN 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
LANGUAGE C LIBRARY lib1 AGENT IN(EXTPROC);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
LANGUAGE C LIBRARY lib1 AGENT IN(EXTPROC)/* [TODO] RULE-14004 : AGENT IN clause must be converted manually */;
~~~

#### RULE-14005

###### 타입

`REMOVED`

###### 설명

ACCESSIBLE BY절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1
ACCESSIBLE BY (TRIGGER trig1)
IS
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1
/* ACCESSIBLE BY (TRIGGER trig1) */ /* [REMOVED] RULE-14005 : The ACCESSIBLE BY clause is removed */
IS
BEGIN
NULL;
END;
~~~


#### RULE-14006

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

JAVA 함수 호출은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 VARCHAR2) AS
LANGUAGE JAVA NAME
'com.altibase.ex.empMgr.addEmp(java.lang.String)';
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 VARCHAR2) AS
LANGUAGE JAVA NAME
'com.altibase.ex.empMgr.addEmp(java.lang.String)';   
/* [TODO] RULE-14006 : Java call specification should be converted manually */
~~~

#### RULE-14007

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

CONTEXT와 SELF 매개변수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER) AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1, a1 LENGTH, SELF);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER) AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1, a1 LENGTH, SELF /* [TODO] RULE-14007 : The parameters CONTEXT and SELF should be manually converted */);
~~~


#### RULE-14008

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

INDICATOR, LENGTH, MAXLEN을 제외한 속성은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER) AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1, a1 CHARSETID, a1 CHARSETFORM);
~~~


###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER) AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1, a1 CHARSETID /* [TODO] RULE-14008 : The property except for INDICATOR, LENGTH, MAXLEN must be converted manually */, a1 CHARSETFORM /* [TODO] RULE-14008 : The property except for INDICATOR, LENGTH, MAXLEN must be converted manually */);
~~~

#### RULE-14009

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

BY REFERENCE 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER) AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1 BY REFERENCE);
~~~

###### 변환된 SQL 문장

~~~sql
CRETE OR REPLACE PROCEDURE proc1(a1 NUMBER) AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1 BY REFERENCE /* [TODO] RULE-14009 : BY REFERENCE clause must be converted manually */);
~~~


#### RULE-14010

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

매개변수의 외부 데이터 타입은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREAT OR REPLACE PROCEDURE proc1(a1 NUMBER) AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1 OCINUMBER);
~~~

###### 변환된 SQL 문장

~~~sql
CREAT OR REPLACE PROCEDURE proc1(a1 NUMBER) AS
LANGUAGE C LIBRARY lib1
PARAMETERS(a1 OCINUMBER /* [TODO] RULE-14010 : External data type of the parameters should be manually converted */);
~~~


### Materialized View 변환 규칙

#### RULE-15004

###### 타입

`REMOVED`

###### 설명

컬럼 별칭 절과 서브쿼리 사이의 모든 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE MATERIALIZED VIEW mview1
ORGANIZATION HEAP PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
NOCOMPRESS LOGGING
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
TABLESPACE test
BUILD IMMEDIATE
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
TABLESPACE tbs1
REFRESH FAST ON DEMAND
WITH PRIMARY KEY USING DEFAULT LOCAL ROLLBACK SEGMENT
USING ENFORCED CONSTRAINTS FOR UPDATE DISABLE QUERY REWRITE
AS SELECT * FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE MATERIALIZED VIEW mview1
/* ORGANIZATION HEAP PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
NOCOMPRESS LOGGING
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
TABLESPACE test
BUILD IMMEDIATE
USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255
STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
TABLESPACE tbs1
REFRESH FAST ON DEMAND
WITH PRIMARY KEY USING DEFAULT LOCAL ROLLBACK SEGMENT
USING ENFORCED CONSTRAINTS FOR UPDATE DISABLE QUERY REWRITE */ /* [REMOVED] RULE-15004 : All clauses between column alias clause and subquery are removed */
AS SELECT * FROM t1;
~~~

### 패키지 변환 규칙

#### RULE-16001

###### 타입

`REMOVED`

###### 설명

AUTHID 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PACKAGE empMgr_pkg AUTHID CURRENT_USER 
AS PROCEDURE delete(p_id INTEGER);
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PACKAGE empMgr_pkg /* AUTHID CURRENT_USER */ /* [REMOVED] RULE-16001 : The invoker rights clause is removed */ 
AS PROCEDURE delete(p_id INTEGER);
END;
~~~

#### RULE-16002

###### 타입

`REMOVED`

###### 설명

ACCESSIBLE BY 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PACKAGE pkg1
ACCESSIBLE BY (TRIGGER trig1)
AS
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PACKAGE pkg1
/* ACCESSIBLE BY (TRIGGER trig1) */ /* [REMOVED] RULE-16002 : The ACCESSIBLE BY clause is removed */
AS
END;
~~~


### 라이브러리 변환 규칙

#### RULE-17001

###### 타입

`REMOVED`

###### 설명

AGENT 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE LIBRARY lib1 AS
'${ORACLE_HOME}/lib/test_lib.so' AGENT 'test.rule.no_17001.com';
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE LIBRARY lib1 AS
'${ORACLE_HOME}/lib/test_lib.so' /* AGENT 'test.rule.no_17001.com' */ /* [REMOVED] RULE-17001 : Agent clause is removed */;
~~~

#### RULE-17002

###### 타입

`REMOVED`

###### 설명

UNTRUSTED가 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE LIBRARY lib1 UNTRUSTED 
AS '${ORACLE_HOME}/lib/test_lib.so';
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE LIBRARY lib1 /* UNTRUSTED */ /* [REMOVED] RULE-17002 : The keyword UNTRUSTED is removed */ 
AS '${ORACLE_HOME}/lib/test_lib.so';
~~~

### DML문 변환 규칙

#### RULE-20001

###### 타입

`TODO`

###### 설명

Flashback 쿼리 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT * FROM t1 CROSS JOIN t2 VERSIONS BETWEEN TIMESTAMP MINVALUE AND MAXVALUE;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT * FROM t1 CROSS JOIN t2 VERSIONS BETWEEN TIMESTAMP MINVALUE AND MAXVALUE/* [TODO] RULE-20001 : Flashback query clause must converted manually */;
~~~

#### RULE-20006

###### 타입

`TODO`

###### 설명

DBLink 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM t1@remote;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM t1@remote /* [TODO] RULE-20006 : DBlink must be converted manually */;
~~~


#### RULE-20007

> *이 규칙은 Altibase 6.5.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

GROUPING SET 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1, c2, c3, c4, SUM( c5 )
FROM t1
GROUP BY GROUPING SETS((c1, c2, c3, c4), (c1, c2, c3), (c3, c4));
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1, c2, c3, c4, SUM( c5 )
FROM t1
GROUP BY GROUPING SETS((c1, c2, c3, c4), (c1, c2, c3), (c3, c4))/* [TODO] RULE-20007 : GROUPING SETS clause must be converted manually */;
~~~


#### RULE-20009

> *이 규칙은 Altibase 6.3.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

CONNECT BY 뒤의 START WITH 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1, c2, c3, c4 FROM t1 CONNECT BY c1 = c2 START WITH c1 = c4;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1, c2, c3, c4 FROM t1 CONNECT BY c1 = c2 START WITH c1 = c4 /* [TODO] RULE-20009 : START WITH clause after CONNECT BY clause must be converted manually */;
~~~

#### RULE-20010

> *이 규칙은 Altibase 6.3.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

NOCYCLE을 변환하려면 IGNORE LOOP를 뒤따라오는 조건 이후에 두어야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1, c2, c3, c4
FROM t1 CONNECT BY NOCYCLE c1 = c2 START WITH c1 = c4;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1, c2, c3, c4
FROM t1 CONNECT BY NOCYCLE /* [TODO] RULE-20010 : To convert 'NOCYCLE', 'IGNORE LOOP' should come after the following condition */ c1 = c2 START WITH c1 = c4;
~~~

#### RULE-20011

###### 타입

`CONVERTED`

###### 설명

힌트가 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT /*+ORDERED */ * FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM t1;
~~~

#### RULE-20012

> *이 규칙은 Altibase 6.1.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

PIVOT절을 확인해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW xmlView
AS
SELECT *
FROM (SELECT d.dname, e.sex FROM departments d, employees e WHERE d.dno = e.dno)
PIVOT XML (COUNT(*) FOR sex IN (ANY))
ORDER BY dname;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW xmlView
AS
SELECT *
FROM (SELECT d.dname, e.sex FROM departments d, employees e WHERE d.dno = e.dno)
PIVOT XML (COUNT(*) FOR sex IN (ANY)) /* [TODO] RULE-20012 : PIVOT clause must be reviewed */
ORDER BY dname;
~~~

#### RULE-20013

> *이 규칙은 Altibase 6.5.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

UNPIVOT절을 확인해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM t1
UNPIVOT (c5 FOR c2 IN (c3 AS 'no', c4 AS 'name'))
ORDER BY c1, c2;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM t1
UNPIVOT (c5 FOR c2 IN (c3 AS 'no', c4 AS 'name')) /* [TODO] RULE-20013 : UNPIVOT clause must be reviewed */
ORDER BY c1, c2;
~~~

#### RULE-20014

###### 타입

`CONVERTED`

###### 설명

스키마명이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE test_user1.proc1(a1 NUMBER)
AS
BEGIN
INSERT INTO test_user1.t1 VALUES(1, 2, 3);
UPDATE test_user2.t1 SET c1 =3, c2 = c2 + 4, c3 = 9 WHERE c4 = 12;
DELETE FROM TEST_USER1.t1 WHERE c4 = 12;
SELECT * INTO :cur1, :cur2 FROM "TEST_USER1".t1;
SELECT * INTO :cur1, :cur2 FROM "Test_User1".t1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
AS
BEGIN
INSERT INTO t1 VALUES(1, 2, 3);
UPDATE test_user2.t1 SET c1 =3, c2 = c2 + 4, c3 = 9 WHERE c4 = 12;
DELETE FROM t1 WHERE C4 = 12;
SELECT * INTO :cur1, :cur2 FROM t1;
SELECT * INTO :cur1, :cur2 FROM "Test_User1".t1;
END;
~~~

#### RULE-20015

> *이 규칙은 Altibase 6.3.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

RETURNING 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION deleteMenu(p_menuName IN VARCHAR2) RETURN INTEGER
AS
v_totalCnt INTEGER;
BEGIN
SELECT COUNT(*) INTO v_totalCnt FROM menus;
DELETE FROM menus WHERE name = p_menuName RETURNING v_totalCnt - COUNT(*) INTO v_totalCnt;
RETURN v_totalCnt;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION deleteMenu(p_menuName IN VARCHAR(32000))
RETURN INTEGER
AS
v_totalCnt INTEGER;
BEGIN
SELECT COUNT(*) INTO v_totalCnt FROM menus;
DELETE FROM menus WHERE name = p_menuName RETURNING v_totalCnt - COUNT(*) INTO v_totalCnt; /* [TODO] RULE-20015 : The RETURNING clause must be converted manually */;
RETURN v_totalCnt;
END;
~~~

#### RULE-20016

###### 타입

`TODO`

###### 설명

CONNECT_BY_ISCYCLE 의사 컬럼은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1,
CONNECT_BY_ISCYCLE "IsCycle",
LEVEL,
SYS_CONNECT_BY_PATH(c1, '/') "Path"
FROM t1
WHERE LEVEL <= 3
START WITH c2 = 100
CONNECT BY PRIOR c2 = c3 AND LEVEL <= 4;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1,
CONNECT_BY_ISCYCLE "IsCycle" /* [TODO] RULE-20016 : The CONNECT_BY_ISCYCLE pseudocolumn must be converted manually */,
LEVEL,
SYS_CONNECT_BY_PATH(c1, '/') "Path"
FROM t1
WHERE LEVEL <= 3
START WITH c2 = 100
CONNECT BY PRIOR c2 = c3 AND LEVEL <= 4;
~~~

#### RULE-20017

> *이 규칙은 Altibase 6.3.1.1.7 이전 버전에 적용된다.*

###### 타입

`REMOVED`

###### 설명

'NULLS FIRST'와 'NULLS LAST'가 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1,
RANK() OVER (ORDER BY c1 NULLS LAST)
FROM t1
ORDER BY c1 NULLS FIRST;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1,
RANK() OVER (ORDER BY c1 /* NULLS LAST */ /* [REMOVED] RULE-20017 : 'NULLS FIRST' and 'NULLS LAST' are  removed */)
FROM t1
ORDER BY c1 /* NULLS LAST */ /* [REMOVED] RULE-20017 : 'NULLS FIRST' and 'NULLS LAST' are removed */;
~~~

#### RULE-20019

###### 타입

`REMOVED`

###### 설명

부질의 제약 절이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM (SELECT * FROM t2 WITH READ ONLY) t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM (SELECT * FROM t2 /* WITH READ ONLY */ /* [REMOVED] RULE-20019 : Restriction clause is removed */) t1;
~~~

#### RULE-20020

###### 타입

`TODO`

###### 설명

CROSS 또는 NATURAL INNER 조인 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM (SELECT * FROM t1) CROSS JOIN t2;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT * FROM (SELECT * FROM t1) CROSS JOIN t2 /* [TODO] RULE-20020 : A CROSS or NATURAL INNER join must be converted manually */;
~~~

#### RULE-20021

###### 타입

`TODO`

###### 설명

조인에서 사용하는 USING 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1, c2 FROM t1 JOIN t2 USING(c1, c2);
~~~


###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT c1, c2 FROM t1 JOIN t2 USING(c1, c2) /* [TODO] RULE-20021 : USING clause in a join must be converted manually */;
~~~


#### RULE-20022

###### 타입

`TODO`

###### 설명

NATURAL Outer 조인 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW sales_view
AS
SELECT * FROM log_guest NATURAL FULL OUTER JOIN log_sales
ORDER BY datetime;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW sales_view AS
SELECT * FROM log_guest NATURAL FULL OUTER JOIN log_sales /* [TODO] RULE-20022 : NATURAL type outer join clause must be converted manually */
ORDER BY datetime;
~~~

#### RULE-20023

###### 타입

`CONVERTED`

###### 설명

UNIQUE가 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT UNIQUE c1 FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1
AS
SELECT DISTINCT c1 FROM t1;
~~~

#### RULE-20028

###### 타입

`CONVERTED`

###### 설명

큰 따옴표가 제거되었다. 단, reconcile "Unacceptable Name" 단계에서 이름에 큰 따옴표가 필요한 객체에 대해 "Use Double-quoted Identifier" 옵션을 선택하면, 해당 이름의 따옴표는 제거되지 않는다. 

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW "USER1"."V1" ("A1")
AS
SELECT "CODE" "A1" FROM "T1"
UNION ALL
SELECT code A1 FROM T2
UNION ALL
SELECT "no" "A1" FROM "T3" WHERE "C6" = '2';
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW USER1.V1(A1)
AS
SELECT CODE A1 FROM T1
UNION ALL
SELECT code A1 FROM T2
UNION ALL
SELECT no A1 FROM T3 WHERE C6 = '2';
~~~

#### RULE-20029

###### 타입

`CONVERTED`

###### 설명

Altibase 예약어에 해당하는 글로벌 식별자(global identifier)는 접미사가 추가되어 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE open(p_objName VARCHAR2, p_objType VARCHAR2)
AS
v_ddl VARCHAR2(200) := 'CREATE ' || p_objType || ' ' || p_objName;
BEGIN
CASE p_objType
WHEN 'TABLE' THEN v_ddl := v_ddl || ' (c1 INTEGER)';
WHEN 'VIEW' THEN v_ddl := v_ddl || ' AS SELECT * FROM dual';
END CASE;
DBMS_OUTPUT.PUT_LINE(v_ddl);
EXECUTE IMMEDIATE v_ddl;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE open_POC(p_objName VARCHAR2, p_objType VARCHAR2) 
AS
v_ddl VARCHAR2(200) := 'CREATE' || p_objType || ' ' || p_objName;
BEGIN
CASE p_objType
WHEN 'TABLE' THEN v_ddl := v_ddl || ' (c1 INTEGER)';
WHEN 'VIEW' THEN v_ddl := v_ddl || ' AS SELECT * FROM dual';
END CASE;
DBMS_OUTPUT.PUT_LINE(v_ddl);
EXECUTE IMMEDIATE v_ddl;
END;
~~~


#### RULE-20030

> *이 규칙은 Altibase 6.5.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

GROUPING SETS 절과 함께 사용된 Window 함수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS SELECT c1, c2, SUM(c3), RANK() OVER(ORDER BY c1)
FROM t1 GROUP BY GROUPING SETS(c1, c2);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS SELECT c1, c2, SUM(c3), RANK() OVER(ORDER BY c1) /* [TODO] 
RULE-20030 : Window functions with the GROUPING SETS clause must be convert manually. */
FROM t1 GROUP BY GROUPING SETS(c1, c2);
~~~

#### RULE-20031

> *이 규칙은 Altibase 6.5.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

복수의 GROUPING SETS절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW mgr_view
AS
SELECT mgr, job, comm, deptno, SUM(sal) FROM emp GROUP BY
GROUPING SETS(job), GROUPING SETS(mgr, deptno), GROUPING SETS(comm);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW mgr_view
AS
SELECT mgr, job, comm, deptno, SUM(sal) FROM emp GROUP BY
GROUPING SETS(job), GROUPING SETS(mgr, deptno), GROUPING SETS(comm) /* [TODO] RULE-20031 : Multiple GROUPING SETS clauses must be converted manually. */;
~~~

#### RULE-20043

###### 타입

`REMOVED`

###### 설명

EDITIONING, EDITIONABLE, NONEDITIONABLE은 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE EDITIONABLE PROCEDURE proc1 AS
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE /* EDITIONABLE */ /* [REMOVED] RULE-20043 : The EDITIONING, EDITIONABLE, and NONEDITIONABLE properties have been removed */ PROCEDURE proc1 AS
BEGIN
NULL;
END;
~~~

#### RULE-20044

###### 타입

`TODO`

###### 설명

파티션의 키 값을 명시한 질의는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 PARTITION FOR ('QA', 'RND');
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 PARTITION FOR ('QA', 'RND') /* [TODO] RULE-20052 : Query partition clause must be converted manually */ /* [TODO] RULE-20044 : The partition extension clause specifying key value must be converted manually */;
~~~

#### RULE-20045

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

WITH절에서 부질의 컬럼의 별칭은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
WITH t1(c1, c2) AS (SELECT * FROM TABLE(func1))
SELECT * FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
WITH t1(c1, c2) /* [TODO] RULE-20045 : The column alias for subquery in the with clause must be converted manually */ AS (SELECT * FROM TABLE(func1))
SELECT * FROM t1;
~~~

#### RULE-20046

> *이 규칙은 Altibase 6.1.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

PIVOT절의 XML은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 PIVOT XML (SUM(c1) FOR c2 IN (ANY));
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 PIVOT XML /* [TODO] RULE-20046 : The XML keyword of the pivot clause must be converted manually */ (SUM(c1) FOR c2 IN (ANY));
~~~

#### RULE-20047

> *이 규칙은 Altibase 6.1.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

pivot_in_clause에 선언된 ANY 또는 부질의는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 PIVOT XML (SUM(c1) FOR c2 IN (ANY));
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 PIVOT XML (SUM(c1) FOR c2 IN (ANY) /* [TODO] RULE-20047 : The ANY keyword or a subquery in the pivot_in_clause must be converted manually */);
~~~

#### RULE-20048

###### 타입

`TODO`

###### 설명

SAMPLE절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 SAMPLE(50);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 SAMPLE(50) /* [TODO] RULE-20048 : The sample clause must be converted manually */;
~~~

#### RULE-20049

###### 타입

`TODO`

###### 설명

ROW LIMITING절은 LIMIT절로 변환되어야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 OFFSET 1 ROW;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 OFFSET 1 ROW /* [TODO] RULE-20049 : The row limiting clause must be converted to the limit clause */;
~~~

#### RULE-20050

###### 타입

`TODO`

###### 설명

FOR UPDATE절에서 SKIP LOCKED는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
v1 NUMBER := 1;
CURSOR cur1 IS SELECT c1 FROM t1 FOR UPDATE SKIP LOCKED;
BEGIN
OPEN cur1;
LOOP
FETCH cur1 INTO v1;
EXIT WHEN cur1%NOTFOUND;
DBMS_OUTPUT.PUT_LINE('v1: ' || v1);
END LOOP;
CLOSE cur1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
v1 NUMBER := 1;
CURSOR cur1 IS SELECT c1 FROM t1 FOR UPDATE SKIP LOCKED /* [TODO] RULE-20050 : SKIP LOCKED in the FOR UPDATE clause must be converted manually */;
BEGIN
OPEN cur1;
LOOP
FETCH cur1 INTO v1;
EXIT WHEN cur1%NOTFOUND;
DBMS_OUTPUT.PUT_LINE('v1: ' || v1);
END LOOP;
CLOSE cur1;
END;
~~~

#### RULE-20051

###### 타입

`TODO`

###### 설명

FOR UPDATE절 내 OF ... 컬럼 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
v1 NUMBER := 1;
CURSOR cur1 IS SELECT c1 FROM t1 FOR UPDATE OF c1;
BEGIN
OPEN cur1;
LOOP
FETCH cur1 INTO v1;
EXIT WHEN cur1%NOTFOUND;
DBMS_OUTPUT.PUT_LINE('v1: ' || v1);
END LOOP;
CLOSE cur1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
v1 NUMBER := 1;
CURSOR cur1 IS SELECT c1 FROM t1 FOR UPDATE OF c1 /* [TODO] RULE-20051 : OF ... column clause in the FOR UPDATE clause must be converted manually */;
BEGIN
OPEN cur1;
LOOP
FETCH cur1 INTO v1;
EXIT WHEN cur1%NOTFOUND;
DBMS_OUTPUT.PUT_LINE('v1: ' || v1);
END LOOP;
CLOSE cur1;
END;
~~~


#### RULE-20052

###### 타입

`TODO`

###### 설명

질의의 파티션 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 LEFT OUTER JOIN t2 PARTITION BY (10) ON t1.c2 = t2.c2;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 LEFT OUTER JOIN t2 PARTITION BY (10) /* [TODO] RULE-20052 : Query partition clause must be converted manually */ ON t1.c2 = t2.c2;
~~~

#### RULE-20053

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

MERGE 구문에서 WHERE 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
MERGE INTO t1 USING t2 ON (t1.c1 = t2.c1)
WHEN MATCHED THEN UPDATE SET t1.c2 = t2.c2 WHERE t1.c1 = 10;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
BEGIN
MERGE INTO t1 USING t2 ON (t1.c1 = t2.c1)
WHEN MATCHED THEN UPDATE SET t1.c2 = t2.c2 WHERE t1.c1 = 10 /* [TODO] RULE-20053 : Where clause of MERGE statement must be converted manually */;
END;
~~~

#### RULE-20054

###### 타입

`REMOVED`

###### 설명

에러 로깅 절은 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
INSERT INTO t1 VALUES('6.12') LOG ERRORS;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
INSERT INTO t1 VALUES('6.12') /* LOG ERRORS */ /* [REMOVED] RULE-20054 : The error logging clause is removed */;
END;
~~~

#### RULE-20055

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

MERGE 구문에서 DELETE WHERE 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
MERGE INTO t1 USING t2 ON (t1.c1 = t2.c1)
WHEN MATCHED THEN UPDATE SET t1.c2 = t2.c2 DELETE t1.c1 = 11;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
MERGE INTO t1 USING t2 ON (t1.c1 = t2.c1)
WHEN MATCHED THEN UPDATE SET t1.c2 = t2.c2 DELETE WHERE t1.c1 = 11 /* [TODO] RULE-20055 : The DELETE WHERE clause in MERGE statement must be converted manually */
END;
~~~

#### RULE-20056

###### 타입

`TODO`

###### 설명

레코드 타입 변수 삽입은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 t1%ROWTYPE) AS
BEGIN
INSERT INTO t1 VALUES a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 t1%ROWTYPE) AS
BEGIN
INSERT INTO t1 VALUES a1 /* [TODO] RULE-20056 : Record variable insert must be converted manually */;
END;
~~~

#### RULE-20057

###### 타입

`TODO`

###### 설명

조건부 삽입 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
INSERT
WHEN team = 'UX' THEN INTO emp_ux
ELSE INTO emp_etc SELECT * FROM employees;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
INSERT
WHEN team = 'UX' THEN INTO emp_ux
ELSE INTO emp_etc SELECT * FROM employees; /* [TODO] RULE-20057 : Conditional insert clause must be converted manually */
END;
~~~

#### RULE-20058

###### 타입

`TODO`

###### 설명

WHERE절의 CURRENT OF 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
c1 NUMBER;
CURSOR cur1 IS SELECT c1 FROM t1 FOR UPDATE;
BEGIN
OPEN cur1;
LOOP
FETCH cur1 INTO c1;
IF c1 > 10 THEN
DELETE FROM t1 WHERE CURRENT OF cur1;
END IF;
EXIT WHEN cur1%NOTFOUND;
END LOOP;
CLOSE cur1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
c1 NUMBER;
CURSOR cur1 IS SELECT c1 FROM t1 FOR UPDATE;
BEGIN
OPEN cur1;
LOOP
FETCH cur1 INTO c1;
IF c1 > 10 THEN
DELETE FROM t1 WHERE CURRENT OF cur1 /* [TODO] RULE-20058 : 'CURRENT OF' clause in the WHERE clause must be converted manually */;
END IF;
EXIT WHEN cur1%NOTFOUND;
END LOOP;
CLOSE cur1;
END;
~~~

#### RULE-20059

이 규칙은 TABLE 함수에 관한 것으로 Altibase 서버 버전에 따라 다르게 적용된다. 

###### 타입

`TODO`

###### 설명

***Altibase 6.5.1 이전***

- TABLE 함수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM TABLE(func1('ALTIBASE'));
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM TABLE(func1('ALTIBASE')) /* [TODO] RULE-20059 : Table function must be converted manually */;
~~~

***Altibase 6.5.1 이상***

- DML(삽입, 삭제, 갱신)에 사용된 TABLE 함수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
DELETE FROM TABLE(SELECT c2 FROM t1) t WHERE t.c1 = 1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
DELETE FROM TABLE(SELECT c2 FROM t1) t /* [TODO] RULE-20059 : The TABLE function with DML(insert, delete, update) must be converted manually */ WHERE t.c1 = 1;
END;
~~~

#### RULE-20060

> *이 규칙은 Altibase 6.5.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

(+) 연산자는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT t1.c1, t1_c2.c2
FROM t1, TABLE(t1.c2) (+) t1_c2;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT t1.c1, t1_c2.c2
FROM t1, TABLE(t1.c2) (+) /* [TODO] RULE-20060 : The (+) operator must be converted manually */ t1_c2;
~~~

#### RULE-20061

> *이 규칙은 Altibase 6.5.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

TABLE 함수의 인자인 컬렉션 표현은 사용자 정의 함수이어야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM TABLE(SELECT c2 FROM t1);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM TABLE(SELECT c2 FROM t1) /* [TODO] RULE-20061 : The collection expression arguments in the TABLE function should be the user-defined function */;
~~~

#### RULE-20062

###### 타입

`TODO`

###### 설명

ONLY절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT * FROM ONLY(v2);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT * FROM ONLY(v2) /* [TODO] RULE-20062 : ONLY Clause must be converted manually */;
~~~

#### RULE-20063

###### 타입

`TODO`

###### 설명

SET절의 레코드 타입 변수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 t1%ROWTYPE) AS
BEGIN
UPDATE t1 SET ROW = a1 WHERE c1 = a1.c1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
UPDATE t1 SET ROW = a1 /* [TODO] RULE-20063 : Record variable in SET clause must be converted manually */ WHERE c1 = a1.c1;
END;
~~~

#### RULE-20065

###### 타입

`TODO`

###### 설명

서브 파티션은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql  
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 SUBPARTITION FOR ('HDB', 'HDB DA');
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 SUBPARTITION for ('HDB', 'HDB DA') /* [TODO] RULE-20065 : SUBPARTITION must be converted manually */ /* [TODO] RULE-20044 : The partition extension clause specifying key value must be converted manually */;
~~~

#### RULE-20066

> *이 규칙은 Altibase 6.1.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

CROSS APPLY 또는 OUTER APPLY 조인은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 CROSS APPLY (SELECT * FROM t2 WHERE t1.c1 = c1);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT *
FROM t1 CROSS APPLY (SELECT * FROM t2 WHERE t1.c1 = c1) /* [TODO] RULE-20066 : CROSS APPLY or OUTER APPLY join must be converted manually */;
~~~

### PSM 변환 규칙

#### RULE-30001

###### 타입

`CONVERTED`

###### 설명

미지원 데이터 타입이 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN VARCHAR2
IS
m_binary_double BINARY_DOUBLE;
m_number NUMBER(10) := 1234;
TYPE rt_n IS RECORD (c1 NATURAL);
TYPE rt_nn IS RECORD (c1 NATURAL);
TYPE tt_1 IS TABLE OF TIMESTAMP(3) INDEX BY VARCHAR2(10);
TYPE tt_2 IS TABLE OF TIMESTAMP(3) WITH TIME ZONE INDEX BY VARCHAR2(10);
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
-- Altibase 7.1 이전 버전
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR(65534))
RETURN VARCHAR(65534)
IS
m_binary_double DOUBLE;
m_number NUMBER (10):= 1234;
TYPE rt_n IS RECORD (c1 INTEGER);
TYPE rt_nn IS RECORD (c1 INTEGER);
TYPE tt_1 IS TABLE OF DATE INDEX BY VARCHAR(10);
TYPE tt_2 IS TABLE OF DATE INDEX BY VARCHAR(10);
BEGIN
RETURN a1;
END;
~~~

~~~sql
-- Altibase 7.1 이상 버전
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR)
RETURN VARCHAR
IS
m_binary_double DOUBLE;
m_number NUMBER (10):= 1234;
TYPE rt_n IS RECORD (c1 INTEGER);
TYPE rt_nn IS RECORD (c1 INTEGER);
TYPE tt_1 IS TABLE OF DATE INDEX BY VARCHAR(10);
TYPE tt_2 IS TABLE OF DATE INDEX BY VARCHAR(10);
BEGIN
RETURN a1;
END;
~~~

#### RULE-30002

###### 타입

`TODO`

###### 설명

미지원 데이터 타입은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1
IS
v_rowid ROWID;
v_urowid UROWID;
BEGIN
NULL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1
IS
v_rowid ROWID /* [TODO] RULE-30002 : Unsupported data type must be converted manually */;
v_urowid UROWID /* [TODO] RULE-30002 : Unsupported data type must be converted manually */;
BEGIN
NULL;
END;
~~~

#### RULE-30003

###### 타입

`TODO`

###### 설명

%TYPE을 참조하는 변수의 데이터 타입이 VARRAY 또는 사용자 정의 타입이라면, 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION getSeason_thailand(p_date DATE) RETURN VARCHAR2
AS
TYPE vt_season IS VARRAY(5) OF INTEGER;
rainy vt_season := vt_season(6, 7, 8, 9, 10);
dry rainy%TYPE := vt_season(11, 12, 1, 2);
v_currSeason VARCHAR2(20) := 'Unknown';
v_currMonth NUMBER(2);
BEGIN
SELECT TO_NUMBER(TO_CHAR(p_date, 'MM')) INTO v_currMonth FROM dual;
FOR i IN 1..rainy.LAST LOOP
IF rainy(i) = v_currMonth THEN
v_currSeason := 'Rainy season';
END IF;
END LOOP;
FOR i IN 1..dry.LAST LOOP
IF dry(i) = v_currMonth THEN
v_currSeason := 'Dry season';
END IF;
END LOOP;
RETURN v_currSeason;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION getSeason_thailand(p_date DATE) RETURN VARCHAR2
AS
TYPE vt_season IS VARRAY(5) OF INTEGER;
rainy vt_season := vt_season(6, 7, 8, 9, 10);
dry rainy%TYPE /* [TODO] RULE-30003 : If the data type of variable referencing the %TYPE were to be a user-defined or VARRAY type, it should be manually converted */ := vt_season(11, 12, 1, 2);
v_currSeason VARCHAR2(20) := 'Unknown';
v_currMonth NUMBER(2);
BEGIN
SELECT TO_NUMBER(TO_CHAR(p_date, 'MM')) INTO v_currMonth FROM dual;
FOR i IN 1..rainy.LAST LOOP
IF rainy(i) = v_currMonth THEN
v_currSeason := 'Rainy season';
END IF;
END LOOP;
FOR i IN 1..dry.LAST LOOP
IF dry(i) = v_currMonth THEN
v_currSeason := 'Dry season';
END IF;
END LOOP;
RETURN v_currSeason;
END;
~~~

#### RULE-30004

###### 타입

`TODO`

###### 설명

변수의 데이터 타입이 VARRAY 또는 사용자 정의 타입이라면, 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION getSeason_thailand(p_date DATE) RETURN VARCHAR2
AS
TYPE vt_season IS VARRAY(5) OF INTEGER;
rainy vt_season := vt_season(6, 7, 8, 9, 10);
dry rainy%TYPE := vt_season(11, 12, 1, 2);
v_currSeason VARCHAR2(20) := 'Unknown';
v_currMonth NUMBER(2);
BEGIN
SELECT TO_NUMBER(TO_CHAR(p_date, 'MM')) INTO v_currMonth FROM dual;
FOR i IN 1..rainy.LAST LOOP
IF rainy(i) = v_currMonth THEN
v_currSeason := 'Rainy season';
END IF;
END LOOP;
FOR i IN 1..dry.LAST LOOP
IF dry(i) = v_currMonth THEN
v_currSeason := 'Dry season';
END IF;
END LOOP;
RETURN v_currSeason;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION getSeason_thailand(p_date DATE) RETURN VARCHAR2
AS
TYPE vt_season IS VARRAY(5) OF INTEGER;
rainy vt_season /* [TODO] RULE-30004 : If the datatype of variable is an VARRAY or user-defined type, the user must convert it manually */ := vt_season(6, 7, 8, 9, 10);
dry rainy%TYPE:= vt_season(11, 12, 1, 2);
v_currSeason VARCHAR3(20) := 'Unknown';
v_currMonth NUMBER(2);
BEGIN
SELECT TO_NUMBER(TO_CHAR(p_date, 'MM')) INTO v_currMonth FROM dual;
FOR i IN 1..rainy.LAST LOOP
IF rainy(i) = v_currMonth THEN
v_currSeason := 'Rainy season';
END IF;
END LOOP;
FOR i IN 1..dry.LAST LOOP
IF dry(i) = v_currMonth THEN
v_currSeason := 'Dry season';
END IF;
END LOOP;
RETURN v_currSeason;
END;
~~~

#### RULE-30005

###### 타입

`REMOVED`

###### 설명

NOT NULL 제약조건은 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
IS
v1 PLS_INTEGER NOT NULL;
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
IS
v1 PLS_INTEGER /*NOT NULL */ /* [REMOVED] RULE-30005 : The NOT NULL constraint is removed */;
BEGIN
RETURN a1;
END;
~~~

#### RULE-30006

> *이 규칙은 Altibase 6.5.1 이전 버전에 적용된다.*

###### 타입

`REMOVED`

###### 설명

NOCOPY는 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE appendSysdate
(
p1 IN OUT NOCOPY VARCHAR2
)
IS
v_date VARCHAR2(50);
BEGIN
SELECT SYSDATE INTO v_date FROM dual;
p1 := p1 || v_date;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE appendSysdate
(
p1 IN OUT /* NOCOPY */ /* [REMOVED] RULE-30006 : NOCOPY is removed */ VARCHAR2
)
IS
v_date VARCHAR2(50);
BEGIN
SELECT SYSDATE INTO v_date FROM dual;
p1 := p1 || v_date;
END;
~~~

#### RULE-30008

###### 타입

`CONVERTED`

###### 설명

Altibase 예약어에 해당하는 지역(Local) 식별자는 변환시 접미사가 추가되었다.

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE printDdlReplEnable
AS
true INTEGER := 1;
BEGIN
DECLARE
isEnable INTEGER := printDdlReplEnable.true;
BEGIN
SELECT value1 INTO isEnable
FROM v$property WHERE name='REPLICATION_DDL_ENABLE';
DBMS_OUTPUT.PUT('[Property]REPLICATION_DDL_ENABLE: ');
IF isEnable = printDdlReplEnable.true THEN
DBMS_OUTPUT.PUT_LINE('true');
ELSE
DBMS_OUTPUT.PUT_LINE('false');
END IF;
END;
END;

~~~

###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE printDdlReplEnable
AS
true_POC INTEGER := 1;
BEGIN
DECLARE
isEnable INTEGER := printDdlReplEnable.true_POC;
BEGIN
SELECT value1 INTO isEnable
FROM v$property WHERE name='REPLICATION_DDL_ENABLE';
DBMS_OUTPUT.PUT('[Property]REPLICATION_DDL_ENABLE:');
IF isEnable = printDdlReplEnable.true_POC THEN
DBMS_OUTPUT.PUT_LINE('true');
ELSE
DBMS_OUTPUT.PUT_LINE('false');
END IF;
END;
END;
~~~

#### RULE-31001

###### 타입

`CONVERTED`

###### 설명

모든 묵시적 커서가 명시적 커서로 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
IS
BEGIN
FOR item1 IN (SELECT c1 FROM t1)
LOOP
NULL;
END LOOP;
FOR item2 IN (SELECT c1 FROM t2)
LOOP
NULL;
END LOOP;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
IS
CURSOR O2A_generated_cur_00 IS (SELECT c1 FROM t1);
CURSOR O2A_generated_cur_01 IS (SELECT c1 FROM t2);
BEGIN
FOR item1 IN O2A_generated_cur_00
LOOP
NULL;
END LOOP;
FOR item2 IN O2A_generated_cur_01
LOOP
NULL;
END LOOP;
END;
~~~

#### RULE-31002

###### 타입

`TODO`

###### 설명

SUBTYPE 타입 변수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
IS
TYPE typ1 IS RECORD ( m1 NUMBER(4) NOT NULL := 99 );
TYPE typ2 IS REF CURSOR RETURN record_name%TYPE;
TYPE typ3 IS TABLE OF a1%TYPE NOT NULL;
TYPE typ4 iS VARYING ARRAY(10) OF INTEGER;
SUBTYPE subtyp1 IS CHAR(10);
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
IS
TYPE typ1 IS RECORD ( m1 NUMBER(4) NOT NULL := 99 );
TYPE typ2 IS REF CURSOR RETURN record_name%TYPE;
TYPE typ3 IS TABLE OF a1%TYPE NOT NULL;
TYPE typ4 iS VARYING ARRAY(10) OF INTEGER;
SUBTYPE subtyp1 IS CHAR(10) /* [TODO] RULE-31002 : SUBTYPE type variable must be converted manually */;
BEGIN
RETURN a1;
END;
~~~

#### RULE-31003

###### 타입

`TODO`

###### 설명

VARRAY타입 변수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION getSeason_korea(p_date DATE) RETURN VARCHAR2 IS
TYPE vt_season IS VARRAY(4) OF VARCHAR2(20);
v_seasonList vt_season := vt_season('Winter', 'Spring', 'Summer', 'Fall');
v_currSeason VARCHAR2(20);
v_currMonth NUMBER(2);
BEGIN
SELECT TO_NUMBER(TO_CHAR(p_date, 'MM')) INTO v_currMonth FROM dual;
v_currSeason := v_seasonList(FLOOR(MOD(v_currMonth, 12) / 3 + 1));
RETURN v_currSeason;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION getSeason_korea(p_date DATE) RETURN VARCHAR2 IS
TYPE vt_season IS VARRAY(4) OF VARCHAR2(20) /* [TODO] RULE-31003 : VARRAY type variable must be converted manually */;
v_seasonList vt_season:= vt_season('Winter', 'Spring', 'Summer', 'Fall');
v_currseason VARCHAR2(20);
v_currMonth NUMBER(2);
BEGIN
SELECT TO_NUMBER(TO_CHAR(p_date, 'MM')) INTO v_currMonth FROM dual;
v_currseason := v_seasonList(FLOOR(MOD(v_currMonth, 12) / 3 + 1));
RETURN a1v_currseason;
END;
~~~

#### RULE-31004

###### 타입

`TODO`

###### 설명

CURSOR의 경우 %ROWTYPE 타입 파라미터는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN t2%ROWTYPE
IS
CURSOR cur1
(
m1 collection_name%TYPE,
m2 t1.c3%ROWTYPE
) RETURN t2%ROWTYPE
IS SELECT c2, c3 FROM t1 WHERE c1 > 10;
BEGIN
RETURN cur1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN t2%ROWTYPE
IS
CURSOR cur1
(
m1 collection_name%TYPE,
m2 t1.c3%ROWTYPE /* [TODO] RULE-31004 : %ROWTYPE type parameter for CURSOR must be converted manually */
) RETURN t2%ROWTYPE
IS SELECT c2, c3 FROM t1 WHERE c1 > 10;
BEGIN
RETURN cur1;
END;
~~~

#### RULE-31005

###### 타입

`TODO`

###### 설명

CURSOR의 RETURN 절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
IS
TYPE typ1 IS REF CURSOR RETURN record_name%TYPE;
CURSOR cur1 ( m1 NUMBER )
RETURN NUMBER
IS SELECT c2, c3 FROM t1 WHERE c1 > 10;
BEGIN
RETURN a1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 NUMBER)
RETURN NUMBER
IS
TYPE typ1 IS REF CURSOR RETURN record_name%TYPE /* [TODO] RULE-31005 : RETURN clause of CURSOR must be converted manually */;
CURSOR cur1 ( m1 NUMBER ) RETURN NUMBER /* [TODO] RULE-31005 : RETURN clause of CURSOR must be converted manually */
IS SELECT c2, c3 FROM t1 WHERE c1 > 10;
BEGIN
RETURN a1;
END;
~~~

#### RULE-31006

###### 타입

`REMOVED`

###### 설명

DECLARE섹션 내에 PROCEDURE 또는 FUNCTION을 정의하거나 선언할 수 없다.

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE util_tblMgr(p_cmd VARCHAR2, p_tblName VARCHAR2) IS
FUNCTION isTblExist(p_tblName VARCHAR2) RETURN BOOLEAN;
FUNCTION isTblExist(p_tblName VARCHAR2) RETURN BOOLEAN AS
v_cnt INTEGER;
BEGIN
SELECT COUNT(*) INTO v_cnt FROM user_tables WHERE table_name = p_tblName;
IF v_cnt > 0 THEN
RETURN true;
ELSE
RETURN false;
END IF;
END;
BEGIN
CASE p_cmd
WHEN 'EXIST' THEN
IF isTblExist(p_tblName) THEN
DBMS_OUTPUT.PUT_LINE(p_tblName || ' exists.');
ELSE
DBMS_OUTPUT.PUT_LINE(p_tblName || ' does not exist.');
END IF;
ELSE DBMS_OUTPUT.PUT_LINE('Unknown command: ' || p_cmd);
END CASE;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE util_tblMgr(p_cmd VARCHAR2, p_tblName VARCHAR2) IS
/* FUNCTION isTblExist(p_tblName VARCHAR2) RETURN BOOLEAN; */ /* [REMOVED] RULE-31006 : Cannot define or declare a procedure or function in the declare section */
/* FUNCTION isTblExist(p_tblName VARCHAR2) RETURN BOOLEAN AS
v_cnt INTEGER;
BEGIN
SELECT COUNT(*) INTO v_cnt FROM user_tables WHERE table_name = p_tblName;
IF v_cnt > 0 THEN
RETURN true;
ELSE
RETURN false;
END IF;
END; */ /* [REMOVED] RULE-31006 : Cannot define or declare a procedure or function in the declare section */
BEGIN
CASE p_cmd
WHEN 'EXIST' THEN
IF isTblExist(p_tblName) THEN
DBMS_OUTPUT.PUT_LINE(p_tblName || ' exists.');
ELSE
DBMS_OUTPUT.PUT_LINE(p_tblName || ' does not exist.');
END IF;
ELSE DBMS_OUTPUT.PUT_LINE('Unknown command: ' || p_cmd);
END CASE;
END;
~~~

#### RULE-31008

이 규칙은 PRAGMA에 관한 규칙으로 Altibase 서버 버전에 따라 변환 결과가 다르다.

###### 타입

`REMOVED`

###### 설명

***Altibase 6.3.1.0.9 이하***

- PRAGMA가 제거되었다. 

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE addShot(p_cnt INTEGER)
AS
PRAGMA AUTONOMOUS_TRANSACTION;
tmp_opt_empty EXCEPTION;
PRAGMA EXCEPTION_INIT(tmp_opt_empty, 100);
v_currcnt INTEGER;
BEGIN
SELECT shot_cnt INTO v_currcnt FROM tmp_opt;
v_currcnt := v_currcnt + p_cnt;
UPDATE tmp_opt SET shot_cnt = v_currcnt WHERE id = 1;
COMMIT;
EXCEPTION
WHEN tmp_opt_empty THEN
INSERT INTO tmp_opt(id, shot_cnt) VALUES (1, p_cnt + 1);
COMMIT;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE addShot(p_cnt INTEGER)
AS
/* PRAGMA AUTONOMOUS_TRANSACTION; */ /* [REMOVED] RULE-31008 : PRAGMA is removed */
tmp_opt_empty EXCEPTION;
/* PRAGMA EXCEPTION_INIT(tmp_opt_empty, 100); */ /* [REMOVED] RULE-31008 : PRAGMA is removed */
v_currcnt INTEGER;
BEGIN
SELECT shot_cnt INTO v_currcnt FROM tmp_opt;
v_currcnt := v_currcnt + p_cnt;
UPDATE tmp_opt SET shot_cnt = v_currcnt WHERE id = 1;
COMMIT;
EXCEPTION
WHEN tmp_opt_empty THEN
INSERT INTO tmp_opt(id, shot_cnt) VALUES (1, p_cnt + 1);
COMMIT;
END;
~~~

***Altibase 6.3.1.0.10 이상***

- PRAGMA AUTONOMOUS_TRANSACTION는 유지한다.

###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE addShot(p_cnt INTEGER)
AS
PRAGMA AUTONOMOUS_TRANSACTION
tmp_opt_empty EXCEPTION;
/* PRAGMA EXCEPTION_INIT(tmp_opt_empty, 100); */ /* [REMOVED] RULE-31008 : PRAGMA is removed */
v_currcnt INTEGER;
BEGIN
SELECT shot_cnt INTO v_currcnt FROM tmp_opt;
v_currcnt := v_currcnt + p_cnt;
UPDATE tmp_opt SET shot_cnt = v_currcnt WHERE id = 1;
COMMIT;
EXCEPTION
WHEN tmp_opt_empty THEN
INSERT INTO tmp_opt(id, shot_cnt) VALUES (1, p_cnt + 1);
COMMIT;
END;
~~~

***Altibase 6.5.1 이상***

- PRAGMA AUTONOMOUS_TRANSACTION, PRAGMA EXCEPTION_INIT을 유지한다.

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE addShot(p_cnt INTEGER) AS
PRAGMA AUTONOMOUS_TRANSACTION;
tmp_opt_empty EXCEPTION;
PRAGMA EXCEPTION_INIT(tmp_opt_empty, 100);
v_currcnt INTEGER;
BEGIN
SELECT shot_cnt INTO v_currcnt FROM tmp_opt;
v_currcnt := v_currcnt + p_cnt;
UPDATE tmp_opt SET shot_cnt = v_currcnt WHERE id = 1;
COMMIT;
EXCEPTION
WHEN tmp_opt_empty THEN
INSERT INTO tmp_opt(id, shot_cnt) VALUES (1, p_cnt + 1);
COMMIT;
END;
~~~

#### RULE-31010

###### 타입

`TODO`

###### 설명

Collection Constructor는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION getSeason_korea(p_date DATE) RETURN VARCHAR2
AS
TYPE vt_season IS VARRAY(4) OF v_currSeason%TYPE;
v_seasonList vt_season := vt_season('Winter', 'Spring', 'Summer', 'Fall');
v_currMonth NUMBER(2);
v_currSeason VARCHAR2(20);
BEGIN
SELECT TO_NUMBER(TO_CHAR(p_date, 'MM')) INTO v_currMonth FROM dual;
v_currSeason := v_seasonList(FLOOR(MOD(v_currMonth, 12) / 3 + 1));
RETURN v_currSeason;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION getSeason_korea(p_date DATE) RETURN VARCHAR(32000)
AS
TYPE vt_season IS VARRAY(4) OF v_currSeason%TYPE;
v_seasonList vt_season:= vt_season('Winter', 'Spring', 'Summer', 'Fall') /* [TODO] RULE-31010 : The collection constructor must be converted manually */;
v_currMonth NUMBER(38, 0);
v_currSeason VARCHAR(32000);
BEGIN
SELECT TO_NUMBER(TO_CHAR(p_date, 'MM')) INTO v_currMonth FROM dual;
v_currSeason := v_seasonList(FLOOR(MOD(v_currMonth, 12) / 3 + 1));
RETURN v_currSeason;
END;
~~~

#### RULE-31011

###### 타입

`TODO`

###### 설명

Associative array의 데이타 타입이 %TYPE 또는 %ROWTYPE으로 정의되었다면 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE PACKAGE tripLog_pkg AS
curr_date DATE := SYSDATE;
TYPE at_city IS TABLE OF curr_date%TYPE INDEX BY VARCHAR2(100);
v_cityList at_city;
PROCEDURE addCity(p_city VARCHAR2, p_date DATE);
PROCEDURE delCity(p_city VARCHAR2);
PROCEDURE printCityList;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE PACKAGE tripLog_pkg AS
curr_date DATE := SYSDATE;
TYPE at_city IS TABLE OF curr_date%TYPE /* [TODO] RULE-31011 : The %TYPE or %ROWTYPE attribute must be converted manually */ INDEX BY VARCHAR2(100);
v_cityList at_city;
PROCEDURE addCity(p_city VARCHAR2, p_date DATE);
PROCEDURE delCity(p_city VARCHAR2);
PROCEDURE printCityList;
END;
~~~

#### RULE-31012

###### 타입

`CONVERTED`

###### 설명

Associative array의 인덱스 데이타 타입이 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE PACKAGE tripLog_pkg AS
curr_date DATE := SYSDATE;
TYPE at_city IS TABLE OF curr_date%TYPE INDEX BY VARCHAR2(100);
v_cityList at_city;
PROCEDURE addCity(p_city VARCHAR2, p_date DATE);
PROCEDURE delCity(p_city VARCHAR2);
PROCEDURE printCityList;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE PACKAGE tripLog_pkg AS
curr_date DATE := SYSDATE;
TYPE at_city IS TABLE OF curr_date%TYPE INDEX BY VARCHAR(100);
v_cityList at_city;
PROCEDURE addCity(p_city VARCHAR2, p_date DATE);
PROCEDURE delCity(p_city VARCHAR2);
PROCEDURE printCityList;
END;
~~~

#### RULE-32001

> *이 규칙은 Altibase 6.3.1 이전 버전에 적용된다.*

###### 타입

`REMOVED`

###### 설명

커서가 열려 있는 중에는 COMMIT을 할 수 없다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
AS
m1 INTEGER;
m2 INTEGER;
m3 INTEGER;
m4 INTEGER;
CURSOR cur1 IS
SELECT c1, c2, c3, c4 FROM t1;
BEGIN
OPEN cur1;
FOR i IN 1 .. 5 LOOP
FETCH cur1 INTO m1, m2, m3, m4;
EXIT WHEN cur1%NOTFOUND;
INSERT INTO t2 VALUES(m1, m2, m3, m4);
END LOOP;
COMMIT;
CLOSE cur1;
COMMIT;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(a1 NUMBER)
AS
m1 INTEGER;
m2 INTEGER;
m3 INTEGER;
m4 INTEGER;
CURSOR cur1 IS
SELECT c1, c2, c3, c4 FROM t1;
BEGIN
OPEN cur1;
FOR i IN 1 .. 5 LOOP
FETCH cur1 INTO m1, m2, m3, m4;
EXIT WHEN cur1%NOTFOUND;
INSERT INTO t2 VALUES(m1, m2, m3, m4);
END LOOP;
/* COMMIT; */ /* [REMOVED] RULE-32001 : Cannot COMMIT while cursor is still open */
CLOSE cur1;
COMMIT;
END;
~~~

#### RULE-32002

> *이 규칙은 Altibase 6.3.1 이전 버전에 적용된다.*

###### 타입

`REMOVED`

###### 설명

커서가 열려 있는 중에는 ROLLBACK을 할 수 없다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE DELETE ON t1
DECLARE
m1 INTEGER;
m2 INTEGER;
m3 INTEGER;
m4 INTEGER;
CURSOR cur1 IS
SELECT c1, c2, c3, c4 FROM t1;
BEGIN
OPEN cur1;
FOR i IN 1 .. 5 LOOP
FETCH cur1 INTO m1, m2, m3, m4;
EXIT WHEN cur1%NOTFOUND;
INSERT INTO t2 VALUES(m1, m2, m3, m4);
END LOOP;
ROLLBACK;
CLOSE cur1;
ROLLBACK;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE TRIGGER trig1
BEFORE DELETE ON t1
DECLARE
m1 INTEGER;
m2 INTEGER;
m3 INTEGER;
m4 INTEGER;
CURSOR cur1 IS
SELECT c1, c2, c3, c4 FROM t1;
BEGIN
OPEN cur1;
FOR i IN 1 .. 5 LOOP
FETCH cur1 INTO m1, m2, m3, m4;
EXIT WHEN cur1%NOTFOUND;
INSERT INTO t2 VALUES(m1, m2, m3, m4);
END LOOP;
/* ROLLBACK; */ /* [REMOVED] RULE-32002 : Cannot ROLLBACK while cursor is still open */
CLOSE cur1;
ROLLBACK;
END;
~~~

#### RULE-32003

###### 타입

`REMOVED`

###### 설명

SET TRANSACTION 구문이 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1IS
BEGIN
NULL;
SET TRANSACTION READ ONLY NAME 'Test Rule 13019';
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1IS
BEGIN
NULL;
/* SET TRANSACTION READ ONLY NAME 'Test Rule 13019'; */ /* [REMOVED] RULE-32003 : The SET TRANSACTION statement is removed */
END;
~~~

#### RULE-32006

###### 타입

`CONVERTED`

###### 설명

변환 가능한 FORALL 구문은 FOR LOOP 구문으로 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE delEmp
AS
TYPE nt_state IS TABLE OF CHAR(1);
stateList nt_state := nt_state('Q', 'V');
BEGIN
FORALL i IN 1..stateList.LAST
DELETE FROM employees WHERE state=stateList(i);
END;
~~~


###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE delEmp
AS
TYPE nt_state IS TABLE OF CHAR(1);
stateList nt_state := nt_state('Q', 'V');
BEGIN
FOR i IN 1 .. stateList.LAST LOOP
DELETE FROM employees WHERE state=stateList(i);
END LOOP;
END;
~~~

#### RULE-32007

###### 타입

`TODO`

###### 설명

변환할 수 없는 FORALL 구문은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE delEmp
AS
TYPE nt_state IS TABLE OF CHAR(1);
stateList nt_state := nt_state('Q', 'V');
BEGIN
FORALL i IN INDICES OF stateList
DELETE FROM employees WHERE state=stateList(i);
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE delEmp
AS
TYPE nt_state IS TABLE OF CHAR(1);
stateList nt_state:= nt_state('Q', 'V');
BEGIN
FORALL i IN INDICES OF stateList
DELETE FROM employees WHERE state=stateList(i); /* [TODO] RULE-32007 : The FORALL statement must be converted manually */
END;
~~~

#### RULE-32008

###### 타입

`CONVERTED`

###### 설명

FOR .. LOOP 구문에서 범위 값 앞 뒤에 공백이 추가되었다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION getCityList RETURN tripLog_pkg.nt_city PIPELINED AS
BEGIN
FOR i IN 1..tripLog_pkg.v_cityList.LAST LOOP
PIPE ROW(tripLog_pkg.v_cityList(i));
END LOOP;
RETURN;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION getCityList
RETURN tripLog_pkg.nt_city PIPELINED AS
BEGIN
FOR i IN 1 .. tripLog_pkg.v_cityList.LAST LOOP
PIPE ROW(tripLog_pkg.v_cityList(i));
END LOOP;
RETURN;
END
~~~

#### RULE-32009

###### 타입

`CONVERTED`

###### 설명

CONTINUE 구문에 있는 조건은 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE showMail(p_from DATE)
AS
v_cnt INTEGER;
v_title VARCHAR2(256);
v_date DATE;
BEGIN
SELECT COUNT(*) INTO v_cnt FROM mailbox;
IF v_cnt > 0 THEN
FOR i IN 1..v_cnt LOOP
SELECT datetime INTO v_date FROM mailbox WHERE id = i;
IF p_from != SYSDATE THEN
CONTINUE WHEN v_date < p_from;
END IF;
SELECT title INTO v_title FROM mailbox WHERE id = i;
DBMS_OUTPUT.PUT_LINE('Title: ' || v_title || ', Date: ' || v_date);
END LOOP;
END IF;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE showMail(p_from DATE)
AS
v_cnt INTEGER;
v_title VARCHAR2(256);
v_date DATE;
BEGIN
SELECT COUNT(*) INTO v_cnt FROM mailbox;
IF v_cnt > 0 THEN
FOR i IN 1 .. v_cnt LOOP
SELECT datetime INTO v_date FROM mailbox WHERE id = i;
IF p_from != SYSDATE THEN
IF v_date < p_from THEN
CONTINUE;
END IF;
END IF;
SELECT title INTO v_title FROM mailbox WHERE id = i;
SYSTEM_.PRINTLN('Title: ' || v_title || ', Date: ' || v_date);
END LOOP;
END IF;
END;
~~~

#### RULE-32010

###### 타입

`TODO`

###### 설명

호스트 변수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
SELECT c2 BULK COLLECT INTO :v_arr FROM t1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
SELECT c2 BULK COLLECT INTO :v_arr /* [TODO] RULE-32010 : The host variable must be converted manually */ FROM t1;
END;
~~~

#### RULE-32012

###### 타입

`TODO`

###### 설명

PIPE ROW 구문은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION getCitiList
RETURN tripLog_pkg.nt_city PIPELINED
AS
BEGIN
FOR i IN 1..tripLog_pkg.v_cityList.LAST LOOP
PIPE ROW(tripLog_pkg.v_cityList(i));
END LOOP;
RETURN;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION getCitiList
RETURN tripLog_pkg.nt_city PIPELINED
AS
BEGIN
FOR i IN 1..tripLog_pkg.v_cityList.LAST LOOP
PIPE ROW(tripLog_pkg.v_cityList(i)) /* [TODO] RULE-32012 : The PIPE ROW statement must be converted manually */;
END LOOP;
RETURN;
END;
~~~

#### RULE-32013

###### 타입

`CONVERTED`

###### 설명

CONTINUE 구문의 label이 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE PROCEDURE showMail(p_from DATE)
AS
v_cnt INTEGER;
v_title VARCHAR2(256);
v_date DATE;
BEGIN
SELECT COUNT(*) INTO v_cnt FROM mailbox;
IF v_cnt > 0 THEN
<<for_loop>>
FOR i IN REVERSE 1..v_cnt LOOP
SELECT datetime INTO v_date FROM mailbox WHERE id = i;
IF v_date <= p_from THEN
CONTINUE for_loop;
END IF;
SELECT title INTO v_title FROM mailbox WHERE id = i;
DBMS_OUTPUT.PUT_LINE('Title: ' || v_title || ', Date: ' || v_date);
END LOOP for_loop;
END IF;
END;
~~~


###### 변환된 SQL 문장

~~~sql
CREATE PROCEDURE showMail(p_from DATE)
AS
v_cnt INTEGER;
v_title VARCHAR2(256);
v_date DATE;
BEGIN
SELECT COUNT(*) INTO v_cnt FROM mailbox;
IF v_cnt > 0 THEN
<<for_loop>>
FOR i IN REVERSE 1 .. v_cnt LOOP
SELECT datetime INTO v_date FROM mailbox WHERE id = i;
IF v_date <= p_from THEN
GOTO O2A_generated_label_00;
END IF;
SELECT title INTO v_title FROM mailbox WHERE id = i;
SYSTEM_.PRINTLN('Title: ' || v_title || ', Date: ' || v_date);
<<O2A_generated_label_00>>
NULL;
END LOOP for_loop;
END IF;
END;
~~~

#### RULE-32014

###### 타입

`TODO`

###### 설명

SCN(System Change Number)은 트랜잭션으로 할당할 수 없다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
COMMIT FORCE 'ORCL.C50E231F042A.10.5.109239', 143217566;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
COMMIT FORCE 'ORCL.C50E231F042A.10.5.109239', 143217566 /* [TODO] RULE-32014 : SCN cannot be assigned to the transaction */;
END;
~~~

#### RULE-32015

###### 타입

`TODO`

###### 설명

CORRUPT_XID_ALL 트랜잭션은 커밋될 수 없다. 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
COMMIT FORCE CORRUPT_XID_ALL;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
COMMIT FORCE CORRUPT_XID_ALL; /* [TODO] RULE-32015 : The corrupt transaction cannot be committed */
END;
~~~


#### RULE-32016

###### 타입

`REMOVED`

###### 설명

COMMIT 구문에 쓰여진 WRITE 절은 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1
AS
v_cnt INTEGER;
BEGIN
SELECT COUNT(*) INTO v_cnt FROM t1;
INSERT INTO t1 VALUES(v_cnt, CURRENT_TIMESTAMP);
COMMIT WRITE NOWAIT IMMEDIATE;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1
AS
v_cnt INTEGER;
BEGIN
SELECT COUNT(*) INTO v_cnt FROM t1;
INSERT INTO t1 VALUES(v_cnt, CURRENT_TIMESTAMP);
COMMIT /* WRITE NOWAIT IMMEDIATE */ /* [REMOVED] RULE-32016 : The WRITE clause in the COMMIT statement is removed */;
END;
~~~


#### RULE-32017

###### 타입

`REMOVED`

###### 설명

COMMIT 구문에 쓰여진 COMMENT 절은 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
COMMIT COMMENT 'PROCEDURE proc1 committed';
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
COMMIT /* COMMENT 'PROCEDURE proc1 committed' */ /* [REMOVED] RULE-32017 : The COMMENT clause in the COMMIT statement is removed */;
END;
~~~


#### RULE-32018

###### 타입

`CONVERTED`

###### 설명

ROLLBACK 구문에 쓰여진 TO [SAVEPOINT] 절은 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
ROLLBACK TO sp1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
ROLLBACK TO SAVEPOINT sp1;
END;
~~~


#### RULE-32019

###### 타입

`REMOVED`

###### 설명

CASE구문에서 label이 삭제되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN VARCHAR2 AS
v1 VARCHAR2(25);
BEGIN
<<test>>
CASE UPPER(a1)
WHEN 'ROCK' THEN v1 := 'Paper';
WHEN 'PAPER' THEN v1 := 'Scissor';
WHEN 'SCISSOR' THEN v1 := 'Rock';
ELSE v1 := 'Unavailable input value';
END CASE test;
RETURN v1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(a1 VARCHAR2)
RETURN VARCHAR2 AS
v1 VARCHAR2(25);
BEGIN
<<test>>
CASE UPPER(a1)
WHEN 'ROCK' THEN v1 := 'Paper';
WHEN 'PAPER' THEN v1 := 'Scissor';
WHEN 'SCISSOR' THEN v1 := 'Rock';
ELSE v1 := 'Unavailable input value';
END CASE ;
RETURN v1;
END;
~~~

#### RULE-32020

> *이 규칙은 Altibase 6.5.1 이전 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

FETCH 구문의 BULK COLLECT INTO절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
TYPE at_1 IS TABLE OF NUMBER;
CURSOR cur1 IS SELECT c1 FROM t1;
arr1 at_1;
BEGIN
OPEN cur1;
FETCH cur1 BULK COLLECT INTO arr1;
DBMS_OUTPUT.PUT_LINE(arr1.COUNT);
CLOSE cur1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
TYPE at_1 IS TABLE OF NUMBER;
CURSOR cur1 IS SELECT c1 FROM t1;
arr1 at_1;
BEGIN
OPEN cur1;
FETCH cur1 BULK COLLECT INTO arr1 /* [TODO] RULE-32020 : BULK COLLECT INTO clause of the FETCH statement must be converted manually */;
DBMS_OUTPUT.PUT_LINE(arr1.COUNT);
CLOSE cur1;
END;
~~~

#### RULE-32021

###### 타입

`TODO`

###### 설명

동적 RETURNING절은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
v1 t1%ROWTYPE;
BEGIN
EXECUTE IMMEDIATE 'DELETE FROM t1 WHERE c1=SYSDATE' RETURNING INTO v1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
v1 t1%ROWTYPE;
BEGIN
EXECUTE IMMEDIATE 'DELETE FROM t1 WHERE c1=SYSDATE' RETURNING INTO v1 /* [TODO] RULE-32021 : Dynamic returning clause must be converted manually */;
END;
~~~

#### RULE-32022

###### 타입

`REMOVED`

###### 설명

부질의문 앞의 THE가 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
v1 NUMBER;
BEGIN
SELECT t1.c1 INTO v1
FROM THE (SELECT EXTRACT(MONTH FROM SYSDATE) curr_month FROM dual) dt, t1
WHERE t1.c2 = dt.curr_month;
DBMS_OUTPUT.PUT_LINE(v1);
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
v1 NUMBER;
BEGIN
SELECT t1.c1 INTO v1
FROM /* THE */ /* [REMOVED] RULE-32022 : The THE keyword is removed */ (SELECT EXTRACT(MONTH FROM SYSDATE) curr_month FROM dual) dt, t1
WHERE t1.c2 = dt.curr_month;
DBMS_OUTPUT.PUT_LINE(v1);
END;
~~~


#### RULE-32024

###### 타입

`REMOVED`

###### 설명

해당 프로시저가 제거되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 ( p_emp_no IN integer ) AS
v1 NUMBER;
BEGIN
DBMS_OUTPUT.ENABLE;
SELECT i1 INTO v1
FROM t1 WHERE i1 = p_emp_no;
DBMS_OUTPUT.PUT_LINE( 'i1 : ' || v1 ); 
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 ( p_emp_no IN integer ) AS
v1 NUMBER;
BEGIN
/* DBMS_OUTPUT.ENABLE; */ /* [REMOVED] RULE-32024 : The target procedure has been removed */
SELECT i1 INTO v1
FROM t1 WHERE i1 = p_emp_no;
DBMS_OUTPUT.PUT_LINE( 'i1 : ' || v1 ); 
END;
~~~

#### RULE-33001

###### 타입

`TODO`

###### 설명

지원하지 않는 예외이다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
NULL;
EXCEPTION
WHEN ACCESS_INTO_NULL THEN
DBMS_OUTPUT.PUT_LINE('Exception Name: ACCESS_INTO_NULL, Error Code: -6530');
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
NULL;
EXCEPTION
WHEN ACCESS_INTO_NULL /* [TODO] RULE-33001 : Unsupported exception */ THEN
DBMS_OUTPUT.PUT_LINE('Exception Name: ACCESS_INTO_NULL, Error Code: -6530');
END;
/
~~~


#### RULE-33002

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

내장 패키지가 Altibase에 설치되었는지 확인하여야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
NULL;
EXCEPTION
WHEN UTL_FILE.INVALID_FILENAME THEN
DBMS_OUTPUT.PUT_LINE('Exception Name: UTL_FILE.INVALID_FILENAME, Error Code:');
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
NULL;
EXCEPTION
WHEN UTL_FILE.INVALID_FILENAME /* [TODO] RULE-33002 : Confirm the target built-in package is installed at Altibase */ THEN
DBMS_OUTPUT.PUT_LINE('Exception Name: UTL_FILE.INVALID_FILENAME, Error Code:');
END;
~~~


#### RULE-33003

###### 타입

`CONVERTED`

###### 설명

해당 예외가 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
NULL;
EXCEPTION
WHEN UTL_FILE.INVALID_PATH THEN
DBMS_OUTPUT.PUT_LINE('Exception Name: UTL_FILE.INVALID_PATH, Error Code:');
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
NULL;
EXCEPTION
WHEN INVALID_PATH THEN
DBMS_OUTPUT.PUT_LINE('Exception Name: UTL_FILE.INVALID_PATH, Error Code:');
END;
~~~


### 표현 변환 규칙

#### RULE-40001

###### 타입

`CONVERTED`

###### 설명

내장 패키지가 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
DBMS_OUTPUT.PUT('Hello');
DBMS_OUTPUT.PUT_LINE('world!');
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
SYSTEM_.PRINT('Hello');
SYSTEM_.PRINTLN('world!');
END;
~~~


#### RULE-40002

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

내장 패키지가 Altibase에 설치되었는지 확인하여야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
DBMS_OUTPUT.NEW_LINE;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1 AS
BEGIN
DBMS_OUTPUT.NEW_LINE /* [TODO] RULE-40002 : Confirm the target built-in package is installed at Altibase */;
END;
~~~

#### RULE-40003

###### 타입

`TODO`

###### 설명

내장 패키지는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(p_file FILE_TYPE) AS
BEGIN
UTL_FILE.PUTF(p_file, 'Hello %s!', 'world');
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1(p_file FILE_TYPE) AS
BEGIN
UTL_FILE.PUTF(p_file, 'Hello %s!', 'world') /* [TODO] RULE-40003 : The target built-in package must be converted manually */;
END;
~~~

#### RULE-40004

###### 타입

`CONVERTED`

###### 설명

해당 SQL 함수가 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT UID FROM dual;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT USER_ID() FROM dual;
~~~

#### RULE-40005

###### 타입

`TODO`

###### 설명

지원하지 않는 함수.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(p1 VARCHAR2)
RETURN NUMBER AS
v1 NUMBER := LENGTHC(p1);
BEGIN
RETURN v1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE FUNCTION func1(p1 VARCHAR2)
RETURN NUMBER AS
v1 NUMBER := LENGTHC(p1) /* [TODO] RULE-40005 : Unsupported function */;
BEGIN
RETURN v1;
END;
~~~

#### RULE-40006

###### 타입

`CONVERTED`

###### 설명

TRIM 함수의 인자들이 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW stats AS
SELECT TRIM(LEADING 0 FROM total_stats)
FROM test_result WHERE date = SYSDATE;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW stats AS
SELECT LTRIM(total_stats, 0)
FROM test_result WHERE date = SYSDATE;
~~~

#### RULE-40007

###### 타입

`CONVERTED`

###### 설명

BIN_TO_NUM 함수의 인자들이 '\|\|'로 연결되어 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW status_view AS
SELECT BIN_TO_NUM(cp_plan, hp_plan, tv_plan, net_plan) status
FROM service_tbl WHERE ym = TO_CHAR(SYSDATE, 'YYYYMM');
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW status_view AS
SELECT BIN_TO_NUM(cp_plan || hp_plan || tv_plan || net_plan) status
FROM service_tbl WHERE ym = TO_CHAR(SYSDATE, 'YYYYMM');
~~~

#### RULE-40008

###### 타입

`TODO`

###### 설명

인자로 부질의를 갖는 CAST 함수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT c1, CAST(MULTISET(SELECT c1 FROM t2 ORDER BY c2) AS tmp_tbl)
FROM t1 ORDER BY c1;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT c1, CAST(MULTISET(SELECT c1 FROM t2 ORDER BY c2) AS tmp_tbl) /* [TODO] RULE-40008 : The CAST function containing a subquery as an argument should be manually converted */
FROM t1 ORDER BY c1;
~~~

#### RULE-40009

###### 타입

`TODO`

###### 설명

복수의 인자를 갖는 DUMP 함수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT DUMP(c3, 8, 3, 2)
FROM t1 WHERE c3 = 100 ORDER BY c2;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW v1 AS
SELECT DUMP(c3, 8, 3, 2) /* [TODO] RULE-40009 : The DUMP function contains multiple arguments should be manually converted */
FROM t1 WHERE c3 = 100 ORDER BY c2;
~~~

#### RULE-40010

###### 타입

`CONVERTED`

###### 설명

EXTRACT 함수가 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE VIEW rsvStats_year AS
SELECT EXTRACT(YEAR FROM rsv_date) year, COUNT(*) cnt
FROM rsv_table GROUP BY EXTRACT(YEAR FROM rsv_date);
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE VIEW rsvStats_year AS
SELECT EXTRACT(rsv_date, 'YEAR') year, COUNT(*) cnt
FROM rsv_table GROUP BY EXTRACT(rsv_date, 'YEAR');
~~~

#### RULE-40011

###### 타입

`TODO`

###### 설명

EXTRACT 함수에서 datetime이 'TIMEZONE'으로 시작하는 경우 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT EXTRACT(TIMEZONE_REGION FROM CURRENT_TIMESTAMP) FROM dual;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT EXTRACT(TIMEZONE_REGION /* [TODO] RULE-40011 : The datetime field prefixed 'TIMEZONE' in the EXTRACT function should be manually converted */ FROM CURRENT_TIMESTAMP) FROM dual;
~~~

#### RULE-40012

###### 타입

`TODO`

###### 설명

XMLType 인스턴스를 인자로 가지는 EXTRACT 함수는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT EXTRACT(emp_into, 'Employee/Name') emp_name FROM dual;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT EXTRACT(emp_info, 'Employee/Name') /* [TODO] RULE-40012 : The EXTRACT function containing XMLType instance as parameters should be manually converted */ emp_name FROM dual;
~~~

#### RULE-40013

###### 타입

`CONVERTED`

###### 설명

SYS_CONTEXT 함수가 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT SYS_CONTEXT('USERENV', 'SESSION_USER') FROM dual;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT USER_NAME() FROM dual;
~~~

#### RULE-40014

###### 타입

`TODO`

###### 설명

CURRENT_TIMESTAMP 함수의 선택적 인자인 정밀도는 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT CURRENT_TIMESTAMP(0) FROM dual;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT CURRENT_TIMESTAMP(0) /* [TODO] RULE-40014 : The optional argument of the function CURRENT_TIMESTAMP, precision must be converted manually */ FROM dual;
~~~

#### RULE-40015

###### 타입

`TODO`

###### 설명

언어를 지정하는 선택적 인자인 nlsparam은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT TO_CHAR(SYSDATE, 'DL', 'NLS_DATE_LANGUAGE = korean') FROM dual;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT TO_CHAR(SYSDATE, 'DL', 'NLS_DATE_LANGUAGE = korean' /* [TODO] RULE-40015 : The optional argument, nlsparam must be converted manually */) FROM dual;
~~~

#### RULE-40016

###### 타입

`TODO`

###### 설명

함수 동작에 변화를 줄 수 있는 선택적 인자인 match_param은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT REGEXP_SUBSTR(content, '(Name: )(([a-z]+) ([a-z]+))', 1, 1, 'i', 3) "First Name" FROM page_pi;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT REGEXP_SUBSTR(content, '(Name: )(([a-z]+) ([a-z]+))', 1, 1, 'i' /* [TODO] RULE-40016 : The optional argument, match_param must be converted manually */, 3) "First Name" FROM page_pi;
~~~

#### RULE-40017

> *이 규칙은 Altibase 6.3.1 이상 버전에 적용된다.*

###### 타입

`TODO`

###### 설명

선택적 인자인 subexpr은 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT REGEXP_SUBSTR(content, '(Name: )(([a-z]+) ([a-z]+))', 1, 1, 'i', 4) "Family Name" FROM page_pi;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW view1 AS
SELECT REGEXP_SUBSTR(content, '(Name: )(([a-z]+) ([a-z]+))', 1, 1, 'i', 4 /* [TODO] RULE-40017 : The optional argument, subexpr must be converted manually */) "Family Name" FROM page_pi;
~~~

#### RULE-40018

###### 타입

`CONVERTED`

###### 설명

MOD 연산자가 함수 형태로 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE FUNCTION func1(p1 PLS_INTEGER) RETURN PLS_INTEGER AS
v1 PLS_INTEGER := p1 MOD 2;
BEGIN
RETURN v1;
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE FUNCTION func1(p1 PLS_INTEGER) RETURN PLS_INTEGER AS
v1 PLS_INTEGER := MOD(p1, 2);
BEGIN
RETURN v1;
END;
~~~

#### RULE-40019

###### 타입

`CONVERTED`

###### 설명

내장 패키지가 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1
AS
BEGIN
DBMS_MVIEW.REFRESH('CAL_MONTH_SALES_MV, FWEEK_PSCAT_SALES_MV', 'CF', '', TRUE, FALSE, 0,0,0, FALSE, FALSE);
END;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE OR REPLACE PROCEDURE proc1
AS
BEGIN
REFRESH_MATERIALIZED_VIEW(USER_NAME(), 'CAL_MONTH_SALES_MV');
REFRESH_MATERIALIZED_VIEW(USER_NAME(), 'FWEEK_PSCAT_SALES_MV');
END;
~~~

#### RULE-40020

###### 타입

`CONVERTED`

###### 설명

WM_CONCAT 함수가 LISTAGG 함수로 변환되었다.

###### 원본 SQL 문장

~~~sql
SELECT WM_CONCAT(val) FROM t1;
~~~

###### 변환된 SQL 문장

~~~sql
SELECT LISTAGG(val, ',') WITHIN GROUP(ORDER BY val) FROM t1;
~~~

#### RULE-40021

###### 타입

`TODO`

###### 설명

SYS_CONTEXT 함수의 파라미터를 수동으로 변환해야 한다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW v_r40021 AS 
SELECT SYS_CONTEXT('USERENV', 'INSTANCE_NAME') FROM dual;
~~~

###### 변환된 SQL 문장

~~~sql
CREATE VIEW v_r40021 AS 
SELECT SYS_CONTEXT('USERENV', 'INSTANCE_NAME') /* [TODO] RULE-40021 : The parameter in the function 'SYS_CONTEXT' should be converted manually.*/ FROM dual;
~~~

#### RULE-40022

###### 타입

`CONVERTED`

###### 설명

반환하는 값의 길이를 나타내는 SYS_CONTEXT 함수의 세번째 인자가 SYS_CONTEXT를 둘러싼 SUBSTR 함수로 변환되었다.

###### 원본 SQL 문장

~~~sql
CREATE VIEW v_r40022 AS SELECT SYS_CONTEXT('USERENV', 'INSTANCE_NAME', 100) FROM dual;
~~~


###### 변환된 SQL 문장

~~~sql
CREATE VIEW v_r40022 AS SELECT SUBSTR(SYS_CONTEXT('USERENV', 'INSTANCE_NAME'), 0, 100) FROM dual;
~~~

<br/>

