import { registerUser, checkUserExists } from "@/app/controllers/RegisterContrller";

export async function POST(req) {
  if (req.method === "POST") {
    return await registerUser(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}

export async function PUT(req) {
  if (req.method === "PUT") {
    return await checkUserExists(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}


