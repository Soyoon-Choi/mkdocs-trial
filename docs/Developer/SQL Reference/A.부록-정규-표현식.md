# A.부록: 정규 표현식

이 장에서 Altibase에서 지원하는 정규 표현식에 대해서 설명한다. 

이 장에서 사용한 샘플 스키마는 $ALTIBASE_HOME/sample/APRE/schema/schema.sql을 이용했다. 

### 정규 표현식

정규 표현식(regular expression)이란 텍스트 패턴을 기술하는 표기법으로, 하나 이상의 문자열과 메타 문자(metacharacter)로 구성된다. 

Altibase는 Altibase 정규 표현식 모드와 PCRE2 호환 모드를 제공한다. Altibase 정규 표현식 모드는 POSIX 기본 정규 표현식(Basic Regular Expression, BRE)과 확장 정규 표현식(Extended Regular Expression, ERE)의 문법을 일부 지원하며 PCRE2 호환 모드는 PCRE2 라이브러리의 정규 표현식 문법을 지원한다. 

정규 표현식 문법이나 기능은 구현체마다 세부 구현이 다르다. DBMS 벤더마다 도입한 정규 표현식 라이브러리나 정규 표현식 라이브러리 버전이 각각 달라서 Altibase에서 지원하는 정규 표현식 문법과 기능이 타 DBMS와 차이가 있을 수 있다.

Altibase SQL에서 정규 표현식은 아래의 문자 함수나 연산자와 함께 사용할 수 있다.

- REGEXP_COUNT
- REGEXP_REPLACE
- REGEXP_INSTR
- REGEXP_SUBSTR
- REGEXP_LIKE 조건 연산자



### 정규 표현식 모드 설정 방법

사용자는 Altibase 정규 표현식 모드와 PCRE2 호환 모드, 두 가지 정규 표현식 모드 중 하나를 선택해서 사용해야 한다. Altibase 정규 표현식 모드가 기본으로 설정되어 있으므로 PCRE2 호환 모드를 사용하고 싶다면 다음 구문으로 정규 표현식 모드를 변경해야 한다.

> ###### 시스템 단위 변경

Altibase 서버가 구동된 상태에서 시스템 프로퍼티를 변경하는 구문으로 정규 표현식 모드를 변경하는 방법이다. 변경한 설정을 적용하려면 세션을 재접속해야 한다. 

~~~sql
ALTER SYSTEM SET REGEXP_MODE=1;
~~~

> ###### 세션 단위 변경

Altibase 서버가 구동된 상태에서 세션의 속성을 변경하는 구문으로 정규 표현식 모드를 변경하는 방법이다.

~~~sql
ALTER SESSION SET REGEXP_MODE=1;
~~~

> ######  Altibase 서버에 영구적으로 변경

변경한 정규 표현식 모드를 영구적으로 Altibase 서버에 적용하는 방법이다. Altibase 서버 프로퍼티 파일에 REGEXP_MODE=1을 추가하고 Altibase 서버를 재시작한다.

~~~sql
$ vi $ALTIBASE_HOME/conf/altibase.properties
REGEXP_MODE=1
~~~



### Altibase 정규 표현식 모드

Altibase의 정규 표현식 모드 중 Altibase 정규 표현식 모드에 대해 살펴보자.

#### 특징

Altibase 정규 표현식 모드는 Altibase의 기본 설정 모드이다. POSIX 기본 정규 표현식과 확장 정규 표현식의 문법을 일부 지원하며 최소한의 정규 표현식 문법을 지원한다.

Altibase 정규 표현식 모드는 아래와 같은 제약 사항이 있다. 

-   멀티바이트 문자를 지원하지 않는다.
-   역참조(backreference, \\digit)를 지원하지 않는다.
-   전방 탐색(lookahead, ?=)과 후방 탐색(lookbehind, ?\<=)을 지원하지 않는다.
-   (?(condition)B\|C)와 같은 조건부 정규 표현식(conditional regular expression)을 지원하지 않는다.

#### 정규 표현식 문법

다음은 Altibase 정규 표현식 모드의 정규 표현식 문법에 대한 설명이다.

##### 메타 문자

메타 문자는 정규 표현식에서 사용하는 특별한 의미를 가지는 기호이다.

| 메타 문자 | 의미                                                         |
| :-------- | :----------------------------------------------------------- |
| \         | 뒤에 오는 메타 문자를 보통 문자로 취급한다.                  |
| ^         | 문자열의 시작 위치를 의미한다.                               |
| .         | 새로운 행을 제외한 임의의 문자 하나와 일치한다. 공백도 한 문자로 인식한다. |
| $         | 문자열의 마지막 위치 또는 줄바꿈 문자로 끝나는 문자열을 의미한다. |
| \|        | 여러 식 중에 하나를 선택한다.                                |
| ()        | 하위 표현식 또는 그룹. 여러 식을 하나로 묶어서 복잡한 정규식을 표현할 수 있다. |
| []        | 문자 클래스를 의미한다.                                      |

##### 반복 찾기

다음은 여러 번 반복되는 문자 또는 문자 집합을 검색할 때 사용하는 메타 문자와 구문이다.

| 메타 문자/구문 | 의미                                                  |
| :------------- | :---------------------------------------------------- |
| *              | 0회 이상 반복되는 문자 또는 문자 집합을 검색한다.     |
| +              | 1회 이상 반복되는 문자 또는 문자 집합을 검색한다.     |
| ?              | 0회 또는 1회 일치하는 문자 또는 문자 집합을 검색한다. |
| {m}            | m회 일치하는 문자 또는 문자 집합을 검색한다.          |
| {m,}           | m회 이상 일치하는 문자 또는 문자 집합을 검색한다.     |
| {m,n}          | 최소 m회, 최대 n회 일치하는 문자 집합을 검색한다.     |

##### 공백 문자

다음은 정규 표현식에서 탭이나 줄바꿈과 같은 눈에 보이지 않는 문자를 검색할 때 사용하는 이스케이프 시퀀스(escape sequence)이다. 

| 이스케이프 시퀀스 | 의미                         |
| :---------------- | :--------------------------- |
| \t                | 탭(tab)                      |
| \n                | 줄바꿈(line feed)            |
| \r                | 캐리지 리턴(carriage return) |
| \f                | 다음 페이지(form feed)       |

##### 문자 클래스

문자 클래스는 자주 사용하는 문자 집합들을 정의한 것이다. 문자 클래스는 이스케이프 스퀀스로 표현하거나 대괄호로 둘러싸인 POSIX 표기법을 사용할 수도 있다. 

| 이스케이프 시퀀스 | POSIX 문자 클래스 | 의미                                                         |
| :---------------- | :---------------- | :----------------------------------------------------------- |
|                   | [:alnum:]         | 알파벳 대소문자와 숫자                                       |
| \\a               | [:alpha:]         | 알파벳 대소문                                                |
| \\A               |                   | \\a를 제외한 모든 문자                                       |
| \\b               |                   | 단어 경계. 단어의 시작이나 마지막                            |
| \\B               |                   | \\b를 제외한 모든 문자                                       |
|                   | [:blank:]         | 공백 문자(space)나 탭(\t)                                    |
| \\c               | [:cntrl:]         | 아스키 코드의 제어 문자. 0번부터 31번, 그리고 127번 문자     |
| \\C               |                   | \\c를 제외한 모든 문자                                       |
| \\d               | [:digit:]         | 10진 숫자                                                    |
| \\D               |                   | \\d를 제외한 모든 문자                                       |
|                   | [:graph:]         | 아스키 코드에서 출력할 수 있는 문자 32 ~ 126 중, 공백 문자(32)를 제외한 문자 |
| \\l               | [:lower:]         | 알파벳 소문자                                                |
|                   | [:print:]         | 아스키 코드에서 출력할 수 있는 문자 32 ~ 126                 |
| \\p               | [:punct:]         | 아스키 코드에서 출력할 수 있는 문자 32 ~ 126 중, 공백 문자, 숫자, 알파벳을 제외한 문자 |
| \\P               |                   | \\p를 제외한 모든 문자                                       |
| \\s               | [:space:]         | 눈에 보이지 않는 공백 문자(space, carriage return, newline, vertical tab, form feed) |
| \\S               |                   | \\s를 제외한 모든 문자                                       |
| \\u               | [:upper:]         | 알파벳 대문자                                                |
| \\w               | [:word:]          | 알파벳 대소문자, 숫자, 언더바(\_)                            |
| \\W               |                   | \\w를 제외한 모든 문자                                       |
| \\x               | [:xdigit:]        | 16진수. 0-9, a-f, A-F                                        |
| \\X               |                   | \\x를 제외한 모든 문자                                       |

### PCRE2 호환 모드

Altibase의 정규 표현식 모드 중 PCRE2 호환 모드에 대해 살펴보자.

PCRE2 호환 모드는 PCRE2 라이브러리의 정규 표현식 문법을 지원한다. 사용된 PCRE2 라이브러리의 버전은 10.40이다.

#### 특징

먼저, PCRE2 호환 모드는 아래와 같은 특징과 제약 사항이 있다.

- Altibase 서버 캐릭터셋이 US7ASCII 또는 UTF-8일 때 사용할 수 있다.
- 한글 검색이 가능하다.
- 역참조, 전방 탐색, 후방 탐색 그리고 조건부 정규 표현식을 지원한다.
- Altibase 정규 표현식 모드와 PCRE2 호환 모드의 정규 표현식 문법은 일부 차이가 있다. 따라서, PCRE2 호환 모드로 설정하면  Altibase 정규 표현식 모드에서 지원하는 문법을 사용할 수 없거나 같은 정규 표현식 문법을 사용하더라도 질의문의 결과가 달라질 수 있다. 대표적인 차이점은 하단의 [정규 표현식 모드 별 문법 차이점](#정규-표현식-모드-별-문법-차이점)을 참고한다.

#### 정규 표현식 문법

PCR2E 호환 모드에서 사용할 수 있는 대표적인 정규 표현식 문법에 대해 알아보자. 본 매뉴얼에서 다루지 않은 PCRE2 라이브러리의 정규 표현식 문법은 [PCRE2 패턴 매뉴얼 페이지](https://www.pcre.org/current/doc/html/pcre2pattern.html)를 참고하기 바란다.

##### 메타 문자

메타 문자는 정규 표현식에서 사용하는 특별한 의미를 가지는 기호이다. PCRE2 호환 모드에서 메타 문자는 대괄호 안을 제외한 어느 곳에서나 인식되는 메타 문자와 대괄호 안에서 사용되는 메타 문자가 있다. 

> ###### 대괄호 밖에서의 메타 문자

| 메타 문자 | 의미                                    |
| :-------- | :-------------------------------------- |
| \         | 여러 용도로 사용되는 이스케이프 문자    |
| ^         | 문자열(또는 여러 줄 모드에서 줄)의 시작 |
| $         | 문자열(또는 여러 줄 모드에서 줄)의 끝   |
| .         | 줄바꿈 문자를 제외한 모든 문자와 일치   |
| [         | 문자 클래스 정의 시작                   |
| \|        | 여러 식 중 하나를 선택                  |
| (         | 그룹 또는 제어 동사 시작                |
| )         | 그룹 또는 제어 동사 끝                  |
| *         | 0회 이상 일치하는 문자                  |
| +         | 1회 이상 일치하는 문자                  |
| ?         | 0 또는 1회 일치하는 문자                |
| {         | 최소/최대값                             |

> ###### 대괄호 안에서의 메타 문자

| 메타 문자 | 의미                                                    |
| :-------- | :------------------------------------------------------ |
| \         | 뒤의 문자를 일반 문자로 인식                            |
| ^         | ^ 바로 뒤 문자나 범위 또는 집합 안의 문자나 범위를 제외 |
| -         | 문자 범위                                               |
| [         | 문자 클래스 시작                                        |
| ]         | 문자 클래스의 종료                                      |

##### 출력할 수 없는 문자

다음은 출력할 수 없는 문자를 의미하는 이스케이프 시퀀스를 정리한 표이다. 

| 이스케이프 시퀀스 | 의미                                                         |
| :---------------- | :----------------------------------------------------------- |
| \a                | 경고음 문자                                                  |
| \c*x*             | control-*x* 문자. *x*는 출력 가능한 아스키 문자가 올 수 있다. |
| \e                | ESC 문자(escape). 아스키 코드의 27번째 문자(hex 1B)          |
| \f                | 다음 페이지(form feed). 아스키 코드의 12번째 문자(hex 0C)    |
| \n                | 줄바꿈 문자(line feed). 아스키 코드의 10번째 문자(hex 0A)    |
| \r                | 캐리지 리턴(carriage return). 아스키 코드의 13번째 문자(hex 0D) |
| \t                | 탭(tab). 아스키 코드의 9번째 문자(hex 09)                    |
| \0*dd*            | 아스키 코드의 8진수 코드 *dd*에 해당하는 문자. 예를 들어 \061은 숫자 1을 의미한다. |
| \\*ddd*           | 아스키 코드의 8진수 코드 *ddd*에 해당하는 문자 또는 역참조를 의미한다. |
| \o{*ddd..*}       | 아스키 코드의 8진수 코드 *ddd...* 에 해당하는 문자           |
| \x*hh*            | 아스키 코드의 16진수 코드 *hh*에 해당하는 문자. 예를 들어 \x31은  숫자 1을 의미한다. |
| \x{*hhh..*}       | 아스키 코드의 16진수 코드 *hhh...* 에 해당하는 문자          |
| \N{U+*hhh..*}     | 유니코드 16진수 코드 *hhh..* 값에 해당하는 문자              |

**예제**

<질의> 이스케이프 시퀀스를 사용하여 아스키 코드 16진수 31에 해당하는 숫자 1을 포함하는 문자열을 검색한다.

~~~sql
iSQL> SELECT GNAME FROM GOODS WHERE REGEXP_LIKE(GNAME, '\x31');
GNAME
------------------------
IM-310
M-150
M-180
M-190G
M-U310
M-T153
M-T102
AU-100
8 rows selected.
~~~

##### 일반 문자 유형

다음은 자주 사용하는 일반 문자 집합들을 의미하는 이스케이프 시퀀스를 정리한 표이다. 

| 이스케이프 시퀀스 | 의미                                         |
| :---------------- | :------------------------------------------- |
| \d                | 10진수 숫자                                  |
| \D                | 10진수 숫자가 아닌 문자                      |
| \h                | 수평 공백 문자, 예를 들어 스페이스와 탭 문자 |
| \H                | 수평 공백 문자가 아닌 문자                   |
| \N                | 줄바꿈 문자가 아닌 문자                      |
| \p{*xx*}          | *xx* 속성을 가진 유니코드 문자               |
| \P{*xx*}          | *xx* 속성이 없는 유니코드 문자               |
| \R                | 줄바꿈 문자                                  |
| \s                | 공백 문자                                    |
| \S                | 공백 문자가 아닌 문자                        |
| \v                | 수직 공백 문자, 예를 들어 줄바꿈 문자        |
| \V                | 수직 공백 문자가 아닌 문자                   |
| \w                | 단어(word) 문자                              |
| \W                | 단어(word) 문자가 아닌 문자                  |
| \X                | 유니코드 확장 문자소 클러스터                |

> ###### 유니코드 문자 속성

\p{*xx*}와 \P{*xx*}에서 사용 가능한 유니코드에서 일반 범주로 분류된 문자 속성을 나타내는 표이다. *xx*로 표시되는 속성은 대소문자를 구분하며 중괄호("{}")는 선택 사항으로 아래의 두 예제는 같은 속성을 의미한다. 

~~~sql
\p{L}
\pL
~~~

| 속성 | 의미                                                         |
| :--- | :----------------------------------------------------------- |
| C    | 기타(Other). C로 시작하는 속성을 모두 포함한다.              |
| Cc   | 제어(Control)                                                |
| Cf   | 형식(Format)                                                 |
| Cn   | 미할당(Unassigned)                                           |
| Co   | 내부 용도(Private use)                                       |
|      |                                                              |
| L    | 문자(Letter). L로 시작하는 속성을 모두 포함한다.             |
| Ll   | 영문자 소문자(Lower case letter)                             |
| Lm   | 수정자(Modifier letter)                                      |
| Lo   | 기타 문자(Other letter)                                      |
| Lt   | 첫 글자가 영문자 대문자인 문자(Title case letter)            |
| Lu   | 영문자 대문자(Upper case letter)                             |
| L&   | 영문자 소문자, 대문자 또는 첫 글자가 대문자인 문자(Ll, Lu, or Lt) |
|      |                                                              |
| M    | 표시(Mark). M으로 시작하는 속성을 모두 포함한다.             |
| Mc   | 띄어쓰기 표시(Spacing mark)                                  |
| Me   | 둘러싸는 표시(Enclosing mark)                                |
| Mn   | 비공백 표시(Non-spacing mark)                                |
|      |                                                              |
| N    | 숫자(Number). N으로 시작하는 속성을 모두 포함한다.           |
| Nd   | 10진수(Decimal number)                                       |
| Nl   | 문자로 표현하는 숫자(Letter number)                          |
| No   | 기타 숫자(Other number)                                      |
|      |                                                              |
| P    | 문장 부호, 구두법(Punctuation). P로 시작하는 속성을 모두 포함한다. |
| Pc   | 연결 문장 부호(Connector punctuation)                        |
| Pd   | 대시 또는 하이픈 문장 부호(Dash punctuation)                 |
| Pe   | 종결 문장 부호. 닫힌, 엄격한 구두법(Close punctuation)       |
| Pf   | 종결 문장 부호(Final punctuation)                            |
| Pi   | 시작 문장 부호(Initial punctuation)                          |
| Po   | 기타 구두(Other punctuation)                                 |
| Ps   | 시작 문장 부호. 열린 구두법(Open punctuation)                |
|      |                                                              |
| S    | 기호(Symbol). S로 시작하는 속성을 모두 포함한다.             |
| Sc   | 화폐 기호(Currency symbol)                                   |
| Sk   | 수정자 기호(Modifier symbol)                                 |
| Sm   | 수학 기호(Mathematical symbol)                               |
| So   | 기타 기호(Other symbol)                                      |
|      |                                                              |
| Z    | 구분자(Separator). Z로 시작하는 속성을 모두 포함한다.        |
| Zl   | 행 구분자(Line separator)                                    |
| Zp   | 단락 구분자(Paragraph separator)                             |
| Zs   | 공백 구분자(Space separator)                                 |
|      |                                                              |
| Xan  | 알파벳과 숫자. L 속성과 N 속성을 모두 포함한다.<br />Alphanumeric: union of properties L and N |
| Xps  | POSIX 공백 문자: Z 속성 또는 탭, 줄바꿈 문자, 수직 탭, 다음 페이지, 캐리지 리턴<br />POSIX space: property Z or tab, NL, VT, FF, CR |
| Xsp  | Perl 공백 문자: Z 속성 또는 탭, 줄바꿈 문자, 수직 탭, 다음 페이지, 캐리지 리턴<br />Perl space: property Z or tab, NL, VT, FF, CR |
| Xuc  | 유니버설 문자 이름<br />Univerally-named character: one that can be represented by a Universal Character Name) |
| Xwd  | Perl 단어: 속성 Xan 또는 밑줄<br />Perl word: property Xan or underscore |

**예제**

<질의> 이스케이프 시퀀스 \p를 사용하여 EMPLOYEES 테이블의 EMP_JOB 컬럼에서 영문자 소문자와 일치하는 유니코드 문자가 포함된 데이터를 조회한다.

~~~sql
iSQL> SELECT EMP_JOB FROM EMPLOYEES WHERE REGEXP_LIKE(EMP_JOB, '\p{Ll}');
EMP_JOB
-------------------
webmaster
manager
planner
3 rows selected.
~~~

> ###### 유니코드 스크립트 이름

\p{*xx*}와 \P{*xx*}의 *xx* 속성에 다음과 같이 유니코드 스크립트 이름을 사용할 수도 있다.

~~~sql
\p{Greek}
\P{Han}
~~~

지원하는 스크립트 목록은 아래와 같다.

~~~
Adlam, Ahom, Anatolian_Hieroglyphs, Arabic, Armenian, Avestan, Balinese, Bamum, Bassa_Vah, Batak, Bengali, Bhaiksuki, Bopomofo, Brahmi, Braille, Buginese, Buhid, Canadian_Aboriginal, Carian, Caucasian_Albanian, Chakma, Cham, Cherokee, Chorasmian, Common, Coptic, Cuneiform, Cypriot, Cypro_Minoan, Cyrillic, Deseret, Devanagari, Dives_Akuru, Dogra, Duployan, Egyptian_Hieroglyphs, Elbasan, Elymaic, Ethiopic, Georgian, Glagolitic, Gothic, Grantha, Greek, Gujarati, Gunjala_Gondi, Gurmukhi, Han, Hangul, Hanifi_Rohingya, Hanunoo, Hatran, Hebrew, Hiragana, Imperial_Aramaic, Inherited, Inscriptional_Pahlavi, Inscriptional_Parthian, Javanese, Kaithi, Kannada, Katakana, Kayah_Li, Kharoshthi, Khitan_Small_Script, Khmer, Khojki, Khudawadi, Lao, Latin, Lepcha, Limbu, Linear_A, Linear_B, Lisu, Lycian, Lydian, Mahajani, Makasar, Malayalam, Mandaic, Manichaean, Marchen, Masaram_Gondi, Medefaidrin, Meetei_Mayek, Mende_Kikakui, Meroitic_Cursive, Meroitic_Hieroglyphs, Miao, Modi, Mongolian, Mro, Multani, Myanmar, Nabataean, Nandinagari, New_Tai_Lue, Newa, Nko, Nushu, Nyakeng_Puachue_Hmong, Ogham, Ol_Chiki, Old_Hungarian, Old_Italic, Old_North_Arabian, Old_Permic, Old_Persian, Old_Sogdian, Old_South_Arabian, Old_Turkic, Old_Uyghur, Oriya, Osage, Osmanya, Pahawh_Hmong, Palmyrene, Pau_Cin_Hau, Phags_Pa, Phoenician, Psalter_Pahlavi, Rejang, Runic, Samaritan, Saurashtra, Sharada, Shavian, Siddham, SignWriting, Sinhala, Sogdian, Sora_Sompeng, Soyombo, Sundanese, Syloti_Nagri, Syriac, Tagalog, Tagbanwa, Tai_Le, Tai_Tham, Tai_Viet, Takri, Tamil, Tangsa, Tangut, Telugu, Thaana, Thai, Tibetan, Tifinagh, Tirhuta, Toto, Ugaritic, Vai, Vithkuqi, Wancho, Warang_Citi, Yezidi, Yi, Zanabazar_Square
~~~

> ###### 유니코드 확장 문자소 클러스터

\X 이스케이프 시퀀스는 유니코드 확장 문자소 클러스터(Unicode extended grapheme cluster)를 의미한다. 자소 집합(grapheme cluster)은 사람이 읽을 수 있는 단일 문자를 말하며 하나의 자소 집합은 여러 개의 코드 포인트(code points)로 이루어진다. 

확장 문자소 클러스터로 구성된 유니코드 캐릭터들과 매치된다. 확장 문자소에 대한 자세한 정보는 [유니코드 공식 문서 UAX #29: Unicode Text Segmentation](http://www.unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries)를 참고하기 바란다. 확장 문자소 매칭에 대한 자세한 정보는 [PCRE2 패턴 매뉴얼 페이지](https://www.pcre.org/current/doc/html/pcre2pattern.html)를 참고하기 바란다.

##### POSIX 문자 클래스

문자 클래스는 자주 사용하는 문자 집합들을 정의한 것이다. 문자 클래스는 [일반 문자 유형](#일반-문자-유형)처럼 이스케이프 시퀀스로 표현하거나 아래 표와 같이 대괄호로 둘러싸인 POSIX 표기법을 사용할 수도 있다. POSIX 문자 클래스는 "[:" 와 ":]"로 둘러싸여 있다. 바깥쪽 대괄호는 문자 집합을 정의하는 것이고 안쪽 대괄호는 POSIX 문자 클래스 문법 자체를 의미한다. 

| POSIX 문자 클래스 | 의미                                                         |
| :---------------- | :----------------------------------------------------------- |
| [[:alnum:]]       | 알파벳과 숫자                                                |
| [[:alpha:]]       | 알파벳 문자                                                  |
| [[:ascii:]]       | 아스키 코드에서 0번부터 127번까지의 문자                     |
| [[:blank:]]       | 스페이스나 탭                                                |
| [[:cntrl:]]       | 아스키 코드에서 127번 문자와 31번 이하의 문자                |
| [[:digit:]]       | 숫자                                                         |
| [[:graph:]]       | 아스키 코드에서 출력할 수 있는 문자 32 ~ 126 중, 공백 문자(32)를 제외한 문자 |
| [[:lower:]]       | 알파벳 소문자                                                |
| [[:print:]]       | 아스키 코드에서 출력할 수 있는 문자 32 ~ 126                 |
| [[:punct:]]       | 아스키 코드에서 출력할 수 있는 문자 32 ~ 126 중, 공백 문자, 숫자, 알파벳을 제외한 문자 |
| [[:space:]]       | 출력되지 않는 공백 문자(space, carriage return, newline, vertical tab, form feed) 등 |
| [[:upper:]]       | 알파벳 대문자                                                |
| [[:word:]]        | 알파벳, 숫자, _                                              |
| [[:xdigit:]]      | 16진수 숫자, 0-9, a-f, A-F                                   |

**예제**

<질의> POSIX 문자 클래스를 사용하여 EMPLOYEES 테이블의 EMP_JOB 컬럼에서 영문자 대문자가 포함된 데이터를 조회하라.

~~~sql
iSQL> SELECT EMP_JOB FROM EMPLOYEES WHERE REGEXP_LIKE(EMP_JOB, '[[:upper:]]');
EMP_JOB          
-------------------
CEO              
PL               
PL               
PM               
PM               
PM               
6 rows selected.
~~~

##### 간단한 어설션

어설션(assertions)은 어떤 문자 또는 문자열의 앞과 뒤를 확인하는 것을 의미한다. [메타 문자](#메타-문자-1)에서 소개한 "^"와 "$"는 어설션의 하나이며 '앵커'라고 부르기도 한다. 

| 이스케이프 시퀀스 | 설명                                                         |
| :---------------- | :----------------------------------------------------------- |
| \A                | 문자열의 시작 위치                                           |
| \b                | 단어 경계. 단어의 시작이나 마지막 위치                       |
| \B                | 단어 경계가 없을 때 일치                                     |
| \G                | 문자열에서 첫 번째 일치 위치                                 |
| \z                | 문자열의 마지막 위치                                         |
| \Z                | 문자열의 마지막 위치 또는 문자열의 마지막 문자인 줄바꿈 문자 바로 전 위치 |

**예제**

<질의> CUSTOMERS 테이블에서 Street 단어가 포함된 주소(ADDRESS)와 고객 번호(CNO)를 조회하라.

~~~sql
iSQL> SELECT CNO, ADDRESS FROM CUSTOMERS WHERE REGEXP_COUNT(ADDRESS, '\bStreet\b') > 0;
CNO                  ADDRESS                                             
----------------------------------------------------------------------------
5                    142 Francis Street Western Australia AUS            
10                   8A Ton Duc Thang Street District 1 HCMC Vietnam     
12                   3484 Taylor Street Dallas TX USA                    
13                   12th Floor Five Kemble Street London UK             
18                   2 Chaoyang Men Wai Street Chaoyang Beijing          
19                   3300 L Street NW Washington DC USA                  
6 rows selected.
~~~

<질의> EMPLOYEES 테이블에서 er 문자로 끝나는 직업을 가진 직원 번호(EMP_JOB)와 직업 이름(EMO)을 조회하라.

~~~sql
iSQL> SELECT ENO, EMP_JOB FROM EMPLOYEES WHERE REGEXP_LIKE(EMP_JOB, 'er\Z');
ENO         EMP_JOB                                             
-------------------------------------------------------------------
2           designer                                            
3           engineer                                            
6           programmer                                          
7           manager                                             
8           manager                                             
9           planner                                             
10          programmer                                          
11          webmaster                                           
15          webmaster                                           
16          manager                                             
18          planner                                             
11 rows selected.
~~~



##### 그룹화 구문

"("와 ")"는 그룹을 표현하는 메타 문자이다. 괄호 안에 여러 표현식을 하나로 묶어 그룹화한 영역을 캡쳐 그룹(capture group)이라고 한다.

| 문법            | 설명                                                         |
| :-------------- | :----------------------------------------------------------- |
| (...)           | 괄호 안에서 지정한 문자열을 검색<br />capture group          |
| (?\<name\>...)  | 캡쳐 그룹의 이름을 지정하는 펄 문법이다.<br />named capture group (Perl) |
| (?'name'...)    | 캡쳐 그룹의 이름을 지정하는 펄 문법이다.<br />named capture group (Perl) |
| (?P\<name\>...) | 캡쳐 그룹의 이름을 지정하는 파이썬 문법이다.<br />named capture group (Python) |
| (?:...)         | 비캡쳐 그룹<br />non-capture group                           |
| (?\|...)        | 비캡쳐 그룹<br />non-capture group; reset group numbers for capture groups in each alternative |
| (?>...)         | 역참조 기능을 없앤 비캡쳐 그룹<br />atomic non-capture group |
| (*atomic:...)   | 역참조 기능을 없앤 비캡쳐 그룹<br />atomic non-capture group |

**예제**

<질의> GOODS 테이블에서 상품 이름(GNAME)이 TM-T, TM-U, M-T, M-U가 포함된 상품을 조회하라.

~~~sql
iSQL> SELECT GNAME FROM GOODS WHERE REGEXP_LIKE(GNAME, '(TM|M)-(T|U)') ;
GNAME                                     
--------------------------------------------
TM-T88                                    
TM-U950                                   
TM-U925                                   
TM-U375                                   
TM-U325                                   
TM-U200                                   
TM-U300                                   
TM-U590                                   
TM-U295                                   
M-T245                                    
M-U310                                    
M-T153                                    
M-T102                                    
M-T500                                    
M-T300                                    
M-T260                                    
M-U420                                    
M-U290
~~~

##### 탐색 구문

찾고자 하는 문자열의 앞 또는 뒤에 지정한 문자열이 있는지 확인한다. 

| 문법                                                         | 설명                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| (?=...)<br />(\*pla:...)<br />(\*positive_lookahead:...)     | 긍정형 전방 탐색(Positive lookaheads)<br />찾고자 하는 문자열 바로 오른쪽에 `...` 에 해당하는 문자열이 있는 문자열을 검색한다. |
| (?!...)<br />(\*nla:...)<br />(\*negative_lookahead:...)     | 부정형 전방 탐색(Negative lookaheads)<br />찾고자 하는 문자열 바로 오른쪽에 `...` 에 해당하는 문자열이 없는 문자열을 검색한다. |
| (?<=...)<br />(\*plb:...)<br />(\*positive_lookbehind:...)   | 긍정형 후방 탐색(Positive lookbehinds)<br />찾고자 하는 문자열 바로 왼쪽에 `...` 에 해당하는 문자열이 있는 문자열을 검색한다. |
| (?<!...)<br />(\*nlb:...)<br />(\*negative_lookbehind:...)   | 부정형 후방 탐색(Negative lookbehinds)<br />찾고자 하는 문자열 바로 왼쪽에 `...` 에 해당하는 문자열이 없는 문자열을 검색한다. |
| (?*...)<br />(\*napla:...)<br />(\*non_atomic_positive_lookahead:...) | 비원자성 긍정형 전방 탐색(Non-atomic positive lookaheads)<br />역참조가 가능한 긍정형 전방 탐색 |
| (?<\*...)<br />(\*naplb:...)<br />(\*non_atomic_positive_lookbehind:...) | 비원자성 긍정형 후방 탐색(Non-atomic positive lookaheads)<br />역참조가 가능한 긍정형 후방 탐색 |

**예제**

<질의> 긍정형 전방 탐색을 사용하여 EMPLOYEES 테이블의 EMP_JOB 컬럼에서 sales 바로 오른쪽에 rep가 있는 데이터를 조회하라.

~~~sql
iSQL> SELECT EMP_JOB FROM EMPLOYEES WHERE REGEXP_LIKE(EMP_JOB, 'sales (?=rep)');
EMP_JOB                                                                                               
--------------------------------------------------------------------------------------------------------
sales rep                                                                                             
sales rep                                                                                             
sales rep                                                                                             
3 rows selected.

iSQL> SELECT EMP_JOB FROM EMPLOYEES WHERE REGEXP_LIKE(EMP_JOB, 'sales (*pla:rep)');
EMP_JOB                                                                                               
--------------------------------------------------------------------------------------------------------
sales rep                                                                                             
sales rep                                                                                             
sales rep                                                                                             
3 rows selected.
~~~

<질의> 부정형 전방탐색을 사용하여 GOODS 테이블의 GNAME 컬럼에서 TM- 문자열 오른쪽에 U가 나오지 않는 데이터를 조회하라. 

~~~sql
iSQL> SELECT GNAME FROM GOODS WHERE REGEXP_LIKE(GNAME, 'TM-(?!U)');
GNAME                                                                                                 
--------------------------------------------------------------------------------------------------------
TM-H5000                                                                                              
TM-T88                                                                                                
TM-L60                                                                                                
3 rows selected.

iSQL> SELECT GNAME FROM GOODS WHERE REGEXP_LIKE(GNAME, 'TM-(*nla:U)');
GNAME                                                                                                 
--------------------------------------------------------------------------------------------------------
TM-H5000                                                                                              
TM-T88                                                                                                
TM-L60                                                                                                
3 rows selected.
~~~

##### 수량자

찾고자 하는 문자가 몇 번 반복하는 지 지정하여 검색한다. 

| 문법   | 설명                                                         |
| :----- | :----------------------------------------------------------- |
| ?      | 앞의 문자가 0번 또는 1번 나오는 문자를 찾는다. 욕심 많은(greedy) 수량자 방식으로 검색한다. |
| ?+     | 앞의 문자가 0번 또는 1번 나오는 문자를 찾는다. 독점적인(possessive) 수량자 방식으로 검색한다. |
| ??     | 앞의 문자가 0번 또는 1번 나오는 문자를 찾는다. 게으른(lazy) 수량자 방식으로 검색한다. |
| *      | 앞의 문자가 0 번 이상 등장하는 문자를 찾는다. 욕심 많은 수량자 방식으로 검색한다. |
| *+     | 앞의 문자가 0 번 이상 등장하는 문자를 찾는다. 독점적인 수량자 방식으로 검색한다. |
| *?     | 앞의 문자가 0 번 이상 등장하는 문자를 찾는다. 게으른 수량자 방식으로 검색한다. |
| +      | 앞의 문자가 1회 이상 나오는 문자를 찾는다. 욕심 많은 수량자 방식으로 검색한다. |
| ++     | 앞의 문자가 1회 이상 나오는 문자를 찾는다. 독점적인 수량자 방식으로 검색한다. |
| +?     | 앞의 문자가 1회 이상 나오는 문자를 찾는다. 게으른 수량자 방식으로 검색한다. |
| {n}    | 앞의 문자가 n회 나오는 문자를 찾는다.                        |
| {n,m}  | 앞의 문자가 최소 n번, 최대 m회 반복되는 문자를 찾는다. 욕심 많은 수량자 방식으로 검색한다. |
| {n,m}+ | 앞의 문자가 최소 n번, 최대 m회 반복되는 문자를 찾는다. 독점적인 수량자 방식으로 검색한다. |
| {n,m}? | 앞의 문자가 최소 n번, 최대 m회 반복되는 문자를 찾는다. 게으른 수량자 방식으로 검색한다. |
| {n,}   | 앞의 문자가 n회 이상 나오는 문자를 찾는다. 욕심 많은 수량자 방식으로 검색한다. |
| {n,}+  | 앞의 문자가 n회 이상 나오는 문자를 찾는다. 독점적인 수량자 방식으로 검색한다. |
| {n,}?  | 앞의 문자가 n회 이상 나오는 문자를 찾는다. 게으른 수량자 방식으로 검색한다. |

**예제**

<질의> CUSTOMERS 테이블에서 고객 주소에서 숫자 뒤에 th가 1번 나오는 주소(ADDRESS)와 고객 번호(CNO)를 조회하라.

~~~sql
iSQL> SELECT CNO, ADDRESS FROM CUSTOMERS WHERE REGEXP_LIKE(ADDRESS, '[0-9]th{1}');
CNO                  ADDRESS                                                       
--------------------------------------------------------------------------------------
2                    4712 West 10th Avenue Vancouver BC Canada                     
9                    10th Floor No. 334 Jiujiang Road Shanghai                     
13                   12th Floor Five Kemble Street London UK                       
3 rows selected.
~~~

##### 역참조

참조해둔 패턴을 숫자 또는 이름으로 다시 사용하는 것을 의미한다.

| 문법       | 설명                                                       |
| :--------- | :--------------------------------------------------------- |
| \n         | 번호를 사용하여 참조 (정규식에 따라 순번이 모호할 수 있음) |
| \gn        | 번호를 사용하여 참조                                       |
| \g{n}      | 번호를 사용하여 참조                                       |
| \g+n       | 번호를 사용한 상대 참조 (PCRE2 확장 문법)                  |
| \g-n       | 번호를 사용한 상대 참조                                    |
| \g{+n}     | 번호를 사용한 상대 참조 (PCRE2 확장 문법)                  |
| \g{-n}     | 번호를 사용한 상대 참조                                    |
| \k\<name\> | 이름을 사용하여 참조 (Perl 문법)                           |
| \k'name'   | 이름을 사용하여 참조 (Perl 문법)                           |
| \g{name}   | 이름을 사용하여 참조 (Perl 문법)                           |
| \k{name}   | 이름을 사용하여 참조 (.NET 문법)                           |
| (?P=name)  | 이름을 사용하여 참조 (Python 문법)                         |

##### 조건부 일치

"\|"로 구분된 문자 중 하나를 하나를 선택하여 검색한다.

| 문법             | 설명                          |
| :--------------- | :---------------------------- |
| expr\|expr\|expr | 여러 식 중에 하나를 선택한다. |

**예제**

<질의> EMPLOYEES 테이블에서 016이나 018로 시작하는 전화번호(EMP_TEL)와 직원 번호(ENO)를 조회하라.

~~~sql
ISQL> SELECT ENO, EMP_TEL FROM EMPLOYEES WHERE REGEXP_LIKE(EMP_TEL, '^016|018');
ENO         EMP_TEL          
--------------------------------
3           0162581369       
4           0182563984       
9           0165293668       
10          0167452000       
13          0187636550       
17          0165293886       
19          0185698550       
7 rows selected.
~~~

##### 정규표현식의 옵션

"(?"와 ")" 사이에 묶인 문자로, 정규표현식에서 특별한 지시를 내리는 기호이다. 

| 옵션    | 설명                                                         |
| :------ | :----------------------------------------------------------- |
| (?i)    | 대소문자 무시                                                |
| (?J)    | 같은 이름을 가지는 그룹 허용                                 |
| (?m)    | 다중 행에서 검색                                             |
| (?n)    | 자동 캡쳐를 사용하지 않음                                    |
| (?s)    | 단일 행에서 검색                                             |
| (?U)    | 비탐욕적(게으른) 방법으로 검색                               |
| (?x)    | 공백 문자를 무시한다. 문자 클래스 안의 공백 문자는 예외이다. |
| (?xx)   | 공백 문자를 무시한다. 문자 클래스 안의 공백 문자도 무시한다. |
| (?-...) | 설정된 옵션(들) 해제                                         |
| (?^)    | imnsx 옵션 해제                                              |

**예제**

<질의> EMPLOYEES 테이블에서 대소문자 구분없이 m이 포함된 성(E_LASTNAME)을 검색하라.

~~~sql
iSQL> SELECT E_LASTNAME FROM EMPLOYEES WHERE REGEXP_LIKE(E_LASTNAME, '(?i)m');
E_LASTNAME                                                    
----------------------------------------------------------------
Moon                                                          
Momoi                                                         
Hammond                                                       
Miura                                                         
Marquez                                                       
5 rows selected.
iSQL> 
~~~

##### 주석

정규표현식에서 사용하는 주석이다. "(?#"는 주석의 시작을 의미하며 닫는 괄호(")")는 주석의 끝을 의미한다.

| 문법     | 설명 |
| :------- | :--- |
| (?#....) | 주석 |

**예제**

<질의>

~~~sql
iSQL> SELECT EMP_JOB FROM EMPLOYEES WHERE REGEXP_LIKE(EMP_JOB, '(?i)M(?#test)A(s|n)');
EMP_JOB
-------------------
webmaster
manager
2 rows selected.
~~~


​	

### 정규 표현식 모드 별 문법 차이점

Altibase 정규 표현식 모드와 PCRE2 호환 모드의 정규 표현식 문법 차이를 나타내는 대표적인 예이다.

| 정규 표현식 문법  | Altibase 정규 표현식 모드                                    | PCRE2 호환 모드                                              | 차이                                                         |
| ----------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| POSIX 문자 클래스 | `SELECT REGEXP_COUNT('ABCDEFG1234567abcdefgh!@#$%^&*(','[:punct:]+');` | `SELECT REGEXP_COUNT('ABCDEFG1234567abcdefgh!@#$%^&*(','[[:punct:]]+');` | POSIX 문자 클래스 표현식이 다르다.                           |
| 이스케이프 스퀀스 | `SELECT REGEXP_COUNT('ABCDEFG1234567abcdefgh!@#$%^&*(','\l+');` | `SELECT REGEXP_COUNT('ABCDEFG1234567abcdefgh!@#$%^&*(','[[:lower:]]+');` | PCRE2 호환 모드에서는 `\l`문법을 지원하지 않는다. [[:lower:]]로 대체할 수 있다. |
| POSIX 동등 클래스 | [=A=]                                                        | -                                                            | 지원하지 않는다.                                             |
|                   | [A-[.CH.]]                                                   | -                                                            | 지원하지 않는다.                                             |



### 정규 표현식 에러 메시지

PCRE2 호환 모드에서 발생하는 에러 중 0x2106C 에러 코드는 아래와 같은 형식으로 에러 메시지가 출력된다. <1%s>는 PCRE2 라이브러리에서 반환한 메시지이며 <0%s>는 Altibase 에서 해당 에러가 발생한 위치를 의미한다. 이 에러 메시지에 대한 원인과 조치 방법은 Error Message Reference의 [15.Regular Expression Error Code](https://github.com/ALTIBASE/Documents/blob/master/Manuals/Altibase_7.3/kor/Error%20Message%20Reference.md#15regular-expression-error-code) 장에서 확인할 수 있다.

~~~bash
ERR-2106C : PCRE2 error: <1%s> (occurred in <0%s>)
~~~

