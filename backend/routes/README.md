# Routes

---

## GET Routes

#### GET User

---

**_Get user_**
router.get("/", authenticate, checkPrivilege([]), getUser);

```
url/user/
```

**_Get all users_**
router.get("/all", authenticate, checkPrivilege(["admin"]), getAllUsers);

```
url/user/all
```

#### GET Products

---

**_Get product_**
router.get("/", authenticate, checkPrivilege([]), getProduct);

```
url/product/
```

**_Get all products_**
router.get("/all", authenticate, checkPrivilege([]), getAllProducts);

```
url/product/all
```

#### GET Job Order

---

**_Get job order summary_**
Params: interval
router.get("/count", authenticate, checkPrivilege(["admin"]), countJobOrder);

```
url/job-orders/count
```

**_Get job order summary by branch_**
Params: interval, branchId
router.get("/count-by-branch", authenticate, checkPrivilege(["admin"]), countJobOrderByBranch);

```
url/job-orders/count-by-branch
```

**_Get all job orders_**
router.get("/get", authenticate, checkPrivilege(["admin"]), getAllJobOrder);

```
url/job-orders/get
```

**_Get all job orders by branch_**
router.get("/get-by-branch", authenticate, checkPrivilege([]), getAllJobOrderByBranch);

```
url/job-orders/get-by-branch
```

#### GET Branch

---

**_Get branch_**
router.get("/", authenticate, checkPrivilege([]), getBranch);

```
url/branch/
```

**_Get all branches_**
router.get("/all", authenticate, checkPrivilege(["admin"]), getAllBranches);

```
url/branch/all
```
