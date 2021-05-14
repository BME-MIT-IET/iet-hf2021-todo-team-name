# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT Development
# Copy csproj and restore as distinct layers
COPY Deadline/*.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY Deadline ./
RUN dotnet publish -c Release -o out

# Build runtime image - 3.1 for now - change to 5.0 later
FROM mcr.microsoft.com/dotnet/aspnet:3.1
WORKDIR /app
COPY --from=build-env /app/out/ .
ENTRYPOINT ["dotnet", "Deadline.dll"]
