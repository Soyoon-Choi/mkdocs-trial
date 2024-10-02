# A. 부록: LOB데이터와 파일

여기에서는 BLOB, CLOB 타입의 데이터를 입력하거나 출력할 때 파일 시스템을 사용하는 방법에 대해 설명한다. 이 방법으로 파일내의 데이터를 테이블로 입력하거나, 테이블의 LOB데이터를 파일로 출력할 수 있다.

### 출력 호스트 변수와 파일

BLOB 또는 CLOB 타입의 칼럼에서 데이터를 조회하여 파일로 저장하고자 할 때, SELECT 내장 문의 INTO 절에 아래와 같이 출력 호스트 변수를 사용하면 된다.

#### 구문

```
BLOB_FILE <:host_variable> OPTION <:file_type> INDICATOR <:indicator>
CLOB_FILE <:host_variable> OPTION <:file_type> INDICATOR <:indicator>
```

#### 인자

- \<:host_variable\>: 데이터를 저장할 파일의 이름을 값으로 가지는 character 타입의 변수


- \<:file_type\>: 데이터를 저장할 파일에 대한 접근 모드를 지정하는 integer 타입의 변수. 아래 값들 중 하나를 지정할 수 있다.

  - APRE_FILE_CREATE: 파일을 새로 생성하고, 그 파일에 데이터를 저장한다. 이미 파일이 존재한다면, 에러가 발생한다.

  - APRE_FILE_OVERWRITE: 파일이 존재한다면, 그 파일의 데이터를 덮어쓴다. 파일이 없다면, 파일을 새로 생성하고 데이터를 저장한다.

  - APRE_FILE_APPEND: 존재하는 파일의 끝에 데이터를 붙여서 쓴다. 파일이 없다면, 에러가 발생한다.


- \<:indicator\>: 반환된 값의 NULL여부를 검사하는 데 사용하거나, 파일에 저장된 데이터의 길이를 구하는 데 사용하는 지시자 변수.


#### 예제

[예제] 다음은 T_LOB 테이블을 검색하여, INTEGER 타입의 칼럼 값을 sI1 호스트 변수에, CLOB 타입의 칼럼 값을 APRE_FILE_CREATE 모드로 생성한 sI2FName의 파일에 저장하는 예를 보여준다.

\<예제 프로그램 : clobSample.sc\>

```
EXEC SQL BEGIN DECLARE SECTION;
int          sI1;
char         sI2FName[33];
unsigned int sI2FOpt;
SQLLEN       sI2Ind;
EXEC SQL END DECLARE SECTION;

strcpy(sI2FName, aOutFileName);
sI2FOpt = APRE_FILE_CREATE;
 
EXEC SQL SELECT * 
INTO :sI1, CLOB_FILE :sI2FName OPTION :sI2FOpt INDICATOR :sI2Ind 
FROM T_LOB;
```

> \* BLOB과 관련한 예제는 \$ALTIBASE_HOME/sample/APRE/BLOB/blobSample.sc에 있으며, CLOB과 사용방법이 유사하다.

### 입력 호스트 변수와 파일

파일의 데이터를 읽어서 BLOB 또는 CLOB 타입의 칼럼에 입력하고자 할 때, INSERT 내장 문에 아래와 같이 입력 호스트 변수를 사용하면 된다.

#### 구문

```
BLOB_FILE <:host_variable> OPTION <:file_type> INDICATOR <:indicator>
CLOB_FILE <:host_variable> OPTION <:file_type> INDICATOR <:indicator>
```

#### 인자

- \<:host_variable\>: 데이터를 읽어올 파일의 이름을 값으로 가지는 character 타입의 변수


- \<:file_type\>: 데이터를 읽어올 파일에 대한 접근 모드를 지정하는 integer 타입의 변수. 아래 값들 중 하나를 지정할 수 있다.

  - APRE_FILE_READ: 데이터를 읽기 위해 파일을 오픈한다. 파일이 없다면, 에러가 발생한다.


- \<:indicator\>: 입력할 값의 NULL여부를 결정하는 데 사용하는 지시자 변수


#### 예제

[예제] 다음은 BLOB 데이터를 APRE_FILE_READ 모드로 파일에서 읽어 T_LOB 테이블에 새로운 레코드를 삽입하는 예를 보여준다.

\<예제 프로그램 : blobSample.sc\>

```
EXEC SQL BEGIN DECLARE SECTION;
int          sI1;
char         sI2FName[32];
unsigned int sI2FOpt;
SQLLEN       sI2Ind;
EXEC SQL END DECLARE SECTION;

sI1 = 1;
strcpy(sI2FName,aInputFileName);
sI2FOpt = APRE_FILE_READ;

EXEC SQL INSERT INTO T_LOB 
VALUES(:sI1, BLOB_FILE :sI2FName OPTION :sI2FOpt INDICATOR :sI2Ind); 
```

