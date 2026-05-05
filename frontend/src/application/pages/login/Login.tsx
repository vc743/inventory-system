import { Box, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animated-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 shadow-md">
              <Box className="h-6 w-6 text-blue-50" />
            </div>
            <span className="text-2xl font-bold">StockFlow</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-gray-500">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <form className="space-y-5">

            <div className="space-y-2 flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="email@example.com"
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-base ring-offset-blue-500 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            <div className="space-y-2 flex flex-col relative">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-base ring-offset-blue-500 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-500/90 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
            // disabled={isLoading}
            >
              {/* {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Iniciando...
                </span>
              ) : ( */}
              Iniciar Sesión
              {/* )} */}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-500 hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-600 p-12">
        <div className="max-w-lg space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500 shadow-md">
            <Box className="h-10 w-10 text-blue-50" />
          </div>
          <h2 className="text-3xl font-bold text-blue-50">
            Gestion tu inventario de forma inteligente
          </h2>
          <p className="text-lg text-blue-50/80">
            Controla entradas, salidas y recibe alertas cuando tus productos
            estén por agotarse. Todo en un solo lugar.
          </p>
          <div className="flex justify-center gap-8 pt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-50">500+</p>
              <p className="text-sm text-blue-50/80">Tiendas activas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-50">50k</p>
              <p className="text-sm text-blue-50/80">Productos gestionados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-50">99.9%</p>
              <p className="text-sm text-blue-50/80">Disponibilidad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login