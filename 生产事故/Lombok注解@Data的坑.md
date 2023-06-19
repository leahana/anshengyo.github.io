# Lombok注解@Data的注意事项

在Java编程中，我们经常会使用Lombok库提供的`@Data`注解来自动地生成getter和setter方法。然而，如果我们不了解它的生成规则，可能会导致一些不符合预期的结果。特别是在使用Mybatis等其他框架时，会因为getter和setter方法的命名规则的不同，产生混淆。

## 1. 实体类示例

```java
public class TestEntity {
    private String name;
    private Boolean isDelete;
    private NMetaType nMetaType;
}
```

## 2. Lombok生成的Getter和Setter

使用Lombok的`@Data`注解生成的getter和setter方法如下：

```java
class TestEntityLombok {
    private String name;
    private Boolean isDelete;
    private NMetaType nMetaType;

    public TestEntityLombok() {
    }

    public String getName() {
        return this.name;
    }

    public Boolean getIsDelete() {
        return this.isDelete;
    }

    public NMetaType getNMetaType() {
        return this.nMetaType;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIsDelete(Boolean isDelete) {
        this.isDelete = isDelete;
    }

    public void setNMetaType(NMetaType nMetaType) {
        this.nMetaType = nMetaType;
    }
}
```

## 3. IDEA，Mybatis和Java默认的Getter和Setter

而使用IDEA，Mybatis或者Java默认的方式生成的getter和setter方法如下：

```java
class TestEntityMybatis {
    private String name;
    private Boolean isDelete;
    private NMetaType nMetaType;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getDelete() {
        return isDelete;
    }

    public void setDelete(Boolean delete) {
        isDelete = delete;
    }

    public NMetaType getnMetaType() {
        return nMetaType;
    }

    public void setnMetaType(NMetaType nMetaType) {
        this.nMetaType = nMetaType;
    }
}
```

## 4. Mybatis.PropertyNamer源码解析

3.5.1 mybatis

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package org.apache.ibatis.reflection.property;

import java.util.Locale;
import org.apache.ibatis.reflection.ReflectionException;

public final class PropertyNamer {
    private PropertyNamer() {
    }

    public static String methodToProperty(String name) {
        if (name.startsWith("is")) {
            name = name.substring(2);
        } else {
            if (!name.startsWith("get") && !name.startsWith("set")) {
                throw new ReflectionException("Error parsing property name '" + name + "'.  Didn't start with 'is', 'get' or 'set'.");
            }

            name = name.substring(3);
        }

        if (name.length() == 1 || name.length() > 1 && !Character.isUpperCase(name.charAt(1))) {
            name = name.substring(0, 1).toLowerCase(Locale.ENGLISH) + name.substring(1);
        }

        return name;
    }

    public static boolean isProperty(String name) {
        return isGetter(name) || isSetter(name);
    }

    public static boolean isGetter(String name) {
        return name.startsWith("get") && name.length() > 3 || name.startsWith("is") && name.length() > 2;
    }

    public static boolean isSetter(String name) {
        return name.startsWith("set") && name.length() > 3;
    }
}

```



Mybatis的PropertyNamer类是用来生成或者判断getter和setter方法的。其主要规则如下：

- `is`开头的，一般为布尔类型，例如`isDelete`，对应的getter方法为`getDelete()`和`setDelete(Boolean delete)`
- 对于属性只有一个字母的，例如`private int x;`，对应的getter和setter方法是`getX()`和`setX(int x)`
- 对于属性名字长度大于1，并且第二个字母是小写的，例如`private NMetaType nMetaType;`，对应的getter和setter方法是`getnMetaType()`和`setnMetaType(NMetaType nMetaType)`

## 5. PropertyNamer测试

通过以下代码，我们可以验证上述规则。

```java
@Test
public void foundPropertyNamer() {
    String isName = "isName";
    String getName = "getName";
    String getnMetaType = "getnMetaType";
    String getNMetaType = "getNMetaType";

    Stream.of(isName,getName,getnMetaType,getNMetaType)
            .forEach(methodName->System.out.println("方法名字是:"+methodName+" 属性名字:"+ PropertyNamer.methodToProperty(methodName)));
}
```

测试结果如下：

```shell
方法名字是:isName 属性名字:name
方法名字是:getName 属性名字:name
方法名字是:getnMetaType 属性名字:nMetaType
方法名字是:getNMetaType 属性名字:NMetaType
```

## 6. 结论

通过对比Lombok生成的getter和setter方法与Mybatis的命名规则，我们可以看出：

Lombok对于第一个字母小写，第二个字母大写的属性生成的getter和setter方法与Mybatis，IDEA，Java官方默认的不一样。例如，对于属性`private NMetaType nMetaType;`，Lombok生成的getter方法是`getNMetaType()`，而Mybatis则认为对应的属性名是`NMetaType`，不是我们预期的`nMetaType`。

## 7. 解决方案

针对这个问题，我们可以采取以下解决方案：

1. 修改属性名字，让第二个字母小写，或者说是规定所有的属性的前两个字母必须小写
2. 如果数据库已经设计好，并且前后端接口对接好了，不想修改，那就专门为这种特殊的属性使用IDEA生成getter和setter方法

总的来说，在使用Lombok的`@Data`注解时，我们需要格外注意属性名的命名，以防止出现不符合预期的结果。





> **作者：**[liuxuzxx](https://juejin.im/user/5b5a8a9ff265da0f7071c1df)
>
> **来源：**[掘金](https://juejin.im/post/6881432532332576781)
