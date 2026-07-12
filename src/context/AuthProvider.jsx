const value = {
    user,
    loading,

    login,
    register,
    logout,

    isAuthenticated: !!user,

    isAdmin: user?.role === "admin",

    isCustomer: user?.role === "customer",
};